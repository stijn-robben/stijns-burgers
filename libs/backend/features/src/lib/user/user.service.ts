import { Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OrderDocument, User, UserDocument } from "./user.schema";
import mongoose, { Model, Types } from "mongoose";
import { ICartItem, IOrder, IUpdateOrder, IUser, Id, Order, Review, Status } from "@herkansing-cswp/shared/api";
import { CreateOrderDto, CreateUserDto, UpdateUserDto } from "@herkansing-cswp/backend/dto";
import { MenuItem, MenuItemDocument } from "../menu-item/menuItem.schema";
import { RecommendationService } from "../recommendation/recommendation.service";

@Injectable()
export class UserService {
    TAG = 'UserService';
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>,
        @InjectModel(Order.name) private readonly orderModel: Model<IOrder>,
        private recommendationService: RecommendationService

    ) {}

    async findAll(): Promise<IUser[]> {
        this.logger.log(`Finding all items`);
        const items = await this.userModel.find(); //doesn't return password when fetching all users
        return items;
    }

    async findOne(_id: Id): Promise<IUser | null> {
        this.logger.log(`finding user with id ${_id}`);
        const item = await this.userModel.findOne({ _id }).exec();
        if (!item) {
            this.logger.debug('Item not found');
        }
        return item;
    }
    

    findOneByEmail(emailAddress: string) {
        this.logger.log(`Finding user by email ${emailAddress}`);
        return this.userModel.findOne({ emailAddress: emailAddress });
    }


    async create(user: CreateUserDto): Promise<IUser> {
        this.logger.log(`Create user ${user.firstName}`);

        if (!user._id || !Types.ObjectId.isValid(user._id)) {
            user._id = new Types.ObjectId().toHexString();
          }
          
        const createdUser = await new this.userModel(user);
        console.log('createdUser', createdUser);
        await this.recommendationService.createOrUpdateUser(createdUser);

        await createdUser.save();
        this.logger.log(`Created user ${createdUser.firstName} ${createdUser.lastName}`);
        return createdUser;
    }

    async update(_id: Id, user: UpdateUserDto): Promise<IUser | null> {
        this.logger.log(`Update user ${user.firstName}`);
        await this.recommendationService.createOrUpdateUser(user);

        return this.userModel.findByIdAndUpdate({ _id }, user, { new: true });
    }


    async delete(_id: Id): Promise<{ deleted: boolean; message?: string }> {
        try {
            const result = await this.userModel.deleteOne({ _id }).exec();
            if (result.deletedCount === 0) {
                this.logger.debug(`No user found to delete with id: ${_id}`);
                return { deleted: false, message: 'No user found with that ID' };
            }
            this.recommendationService.deleteUserNeo(_id);

            this.logger.log(`Deleted user with id: ${_id}`);
            return { deleted: true };
        } catch (error) {
            this.logger.error(`Error deleting user with id ${_id}: ${error}`);
            throw error;
        }
    }

    async findNameById(_id: Id): Promise<string | null> {
        this.logger.log(`Finding name of user with id ${_id}`);
        const user = await this.userModel.findById(_id, 'firstName lastName').exec();
        if (!user) {
            this.logger.debug('User not found');
            return null;
        }
        return `${user.firstName} ${user.lastName}`;
    }


      async addToCart(userId: string, cartItem: ICartItem): Promise<IUser> {
        this.logger.log(`Adding cart item to user ${userId}`);
    
        const user = await this.userModel.findById(userId).exec();
    
        if (!user) {
            this.logger.debug('User not found');
            throw new NotFoundException(`User with id ${userId} not found`);
        }
    
        // Check if the cart item already exists in the user's cart
        const existingCartItem = user.cart.find(item => item.menuItemId === cartItem.menuItemId);
    
        if (existingCartItem) {
            // If the cart item already exists, increase the quantity and aggregate the price
            existingCartItem.quantity += cartItem.quantity;
            existingCartItem.price += cartItem.price * cartItem.quantity; // Multiply price by quantity
        } else {
            // If the cart item does not exist, add it to the cart
            cartItem.price *= cartItem.quantity; // Multiply price by quantity
            user.cart.push(cartItem);
        }
        await this.recommendationService.addMenuItemToUserCart(userId, cartItem._id);

        const updatedUser = await user.save();
        return updatedUser;
    }
    async removeFromCart(userId: string, cartItemId: string): Promise<{ deleted: boolean; message?: string }> {
      try {
          const user = await this.userModel.findById(userId).exec();
          if (!user) {
              this.logger.debug(`No user found with id: ${userId}`);
              return { deleted: false, message: 'No user found with that ID' };
          }
  
          const cartItemIndex = user.cart.findIndex(item => item._id.toString() === cartItemId);
          if (cartItemIndex === -1) {
              this.logger.debug(`No cart item found with id: ${cartItemId}`);
              return { deleted: false, message: 'No cart item found with that ID' };
          }
  
          user.cart.splice(cartItemIndex, 1);
          await user.save();
          await this.recommendationService.deleteItemFromUserCart(userId, cartItemId);
          this.logger.log(`Deleted cart item with id: ${cartItemId}`);
          return { deleted: true };
      } catch (error) {
          this.logger.error(`Error deleting cart item with id ${cartItemId}: ${error}`);
          throw error;
      }
  }

  async getUnitPrice(menuItemId: string): Promise<number> {
    const menuItem = await this.menuItemModel.findById(menuItemId).exec();

    if (!menuItem) {
        this.logger.debug('Menu item not found');
        throw new NotFoundException(`Menu item with id ${menuItemId} not found`);
    }

    return menuItem.price;
}

  async updateCartItem(userId: string, cartItemId: string, quantity: number): Promise<IUser> {
    this.logger.log(`Updating cart item for user ${userId}`);

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
        this.logger.debug('User not found');
        throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Find the cart item in the user's cart array
    const cartItem = user.cart.find(item => item._id.toString() === cartItemId);

    if (!cartItem) {
        this.logger.debug('Cart item not found');
        throw new NotFoundException(`Cart item with id ${cartItemId} not found`);
    }

    // Update the quantity of the cart item
    cartItem.quantity = quantity;

    // Recalculate the price of the cart item
    const unitPrice = await this.getUnitPrice(cartItem.menuItemId);
    cartItem.price = unitPrice * quantity;

    const updatedUser = await user.save();
    return updatedUser;
}

      async getCartItems(userId: string): Promise<ICartItem[]> {
        this.logger.log(`Getting cart items for user ${userId}`);
      
        const user = await this.userModel.findById(userId).exec();
      
        if (!user) {
          this.logger.debug('User not found');
          throw new NotFoundException(`User with id ${userId} not found`);
        }
      
        return user.cart;
      }

      async deleteCartItems(userId: string): Promise<void> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.cart = [];
        await user.save();
    }

    async createOrder(userId: string, orderDto: CreateOrderDto, loggedInUserId: string): Promise<{ user: IUser, order: IOrder }> {
        const existingUser = await this.userModel.findById(userId).exec();
      
        if (!existingUser) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }
      
        // Check if the logged in user is the same as the user we're trying to create the order for
        if (loggedInUserId !== userId) {
            throw new UnauthorizedException();
        }
      
        const { order_date, ...restOrderDto } = orderDto;
      
        const order: IOrder = {
            _id: new mongoose.Types.ObjectId().toString(), // convert ObjectId to string
            order_date: new Date(), // corrected from userts
            ...restOrderDto,
            _id_user: loggedInUserId,
        };
      
        // Add the order to the orders array
        existingUser.orders.push(order);
      
        const updatedUser = await existingUser.save();
      
        // Create a new order in the 'Order' document
        const newOrderDocument = new this.orderModel(order);
        await newOrderDocument.save();
      
        // Get the last order (the one just added)
        const newOrder = updatedUser.orders[updatedUser.orders.length - 1];
      
        // Return the updated user and the new order
        return { user: updatedUser, order: newOrder };
      }


}