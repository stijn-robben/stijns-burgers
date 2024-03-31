import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model, Types } from "mongoose";
import { IUser, Id } from "@herkansing-cswp/shared/api";
import { CreateUserDto, UpdateUserDto } from "@herkansing-cswp/backend/dto";

@Injectable()
export class UserService {
    TAG = 'UserService';
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
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
          
        const createdUser = new this.userModel(user);
        await createdUser.save();
        this.logger.log(`Created user ${createdUser.firstName} ${createdUser.lastName}`);
        return createdUser;
    }

    async update(_id: Id, user: UpdateUserDto): Promise<IUser | null> {
        this.logger.log(`Update user ${user.firstName}`);
        return this.userModel.findByIdAndUpdate({ _id }, user, { new: true });
    }


    async delete(_id: Id): Promise<{ deleted: boolean; message?: string }> {
        try {
            const result = await this.userModel.deleteOne({ _id }).exec();
            if (result.deletedCount === 0) {
                this.logger.debug(`No user found to delete with id: ${_id}`);
                return { deleted: false, message: 'No user found with that ID' };
            }
            this.logger.log(`Deleted user with id: ${_id}`);
            return { deleted: true };
        } catch (error) {
            this.logger.error(`Error deleting user with id ${_id}: ${error}`);
            throw error;
        }
    }

    async addReviewToUser(userId: string, reviewId: string): Promise<IUser> {
        this.logger.log(`Adding review ${reviewId} to user ${userId}`);
      
        const user = await this.userModel.findById(userId).exec();
      
        if (!user) {
          this.logger.debug('User not found');
          throw new NotFoundException(`User with id ${userId} not found`);
        }
      
        // Add the review ID to the user's reviews array
        user.reviews.push(reviewId);
      
        const updatedUser = await user.save();
        return updatedUser;
      }

      
}