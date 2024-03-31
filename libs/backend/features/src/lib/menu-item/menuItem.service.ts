import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MenuItem, MenuItemDocument, Review } from "./menuItem.schema";
import { CreateMenuItemDto, UpdateMenuItemDto } from "@herkansing-cswp/backend/dto";
import { IMenuItem, IReview } from "@herkansing-cswp/shared/api";
import { User, UserDocument } from "../user/user.schema";

@Injectable()
export class MenuItemService {

    private readonly logger: Logger = new Logger(MenuItemService.name);

    constructor(
        @InjectModel(MenuItem.name)
        private menuItemModel: Model<MenuItemDocument>,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(Review.name)
        private reviewModel: Model<UserDocument>,
      ) {}

    async getAll(): Promise<MenuItemDocument[]> {
        this.logger.log(`Finding all items in the menu.`);
        const items = await this.menuItemModel.find();
        return items;
    }

    async getOne(id: string): Promise<MenuItemDocument | null> {
        this.logger.log(`Finding item with id ${id}`);
        const item = await this.menuItemModel.findOne({ _id: id }).exec();
        return item;
    }
    

    async update(menuItemId: string, updateMenuItemDto: UpdateMenuItemDto): Promise<IMenuItem> {
        const existingMenuItem = await this.menuItemModel.findById(menuItemId).exec();
    
        if (!existingMenuItem) {
          throw new NotFoundException(`Product with id ${menuItemId} not found`);
        }
    
        Object.assign(existingMenuItem, updateMenuItemDto);
        const updatedMenuItem = await existingMenuItem.save();
        return updatedMenuItem;
    }
    

    async create(menuItemDto: CreateMenuItemDto): Promise<IMenuItem> {
    this.logger.log(`Creating new menu item`);
    menuItemDto.reviews = [];
    const createdMenuItem = await this.menuItemModel.create(menuItemDto);
    return createdMenuItem;
    }

    async createReview(menuItemId: string, review: IReview, loggedInUserId: string): Promise<{ menuItem: IMenuItem, review: IReview }> {
      const existingMenuItem = await this.menuItemModel.findById(menuItemId).exec();
      
      if (!existingMenuItem) {
          throw new NotFoundException(`Menu item with id ${menuItemId} not found`);
      }
    
      // Add the logged in user ID to the review
      review._id_user = loggedInUserId;
    
      // Add the review to the reviews array
      existingMenuItem.reviews.push(review);
    
      const updatedMenuItem = await existingMenuItem.save();
    
      // Get the last review (the one just added)
      const newReview = updatedMenuItem.reviews[updatedMenuItem.reviews.length - 1];
    
      // Return the updated menu item and the new review
      return { menuItem: updatedMenuItem, review: newReview };
    }
  

    async delete(id: string): Promise<void> {
        this.logger.log(`Deleting menuitem with id ${id}`);
        const deletedItem = await this.menuItemModel.findByIdAndDelete(id).exec();
    
        if (!deletedItem) {
          this.logger.debug('Product not found');
          throw new NotFoundException(`Product with id ${id} not found`);
        }
    
        this.logger.log(`Product deleted successfully`);
      }

    
}