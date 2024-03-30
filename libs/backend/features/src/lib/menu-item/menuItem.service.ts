import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { MenuItemModule } from "./menuItem.module";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MenuItemDocument } from "./menuItem.schema";
import { CreateMenuItemDto, UpdateMenuItemDto } from "@herkansing-cswp/backend/dto";
import { IMenuItem, IReview } from "@herkansing-cswp/shared/api";

@Injectable()
export class MenuItemService {

    private readonly logger: Logger = new Logger(MenuItemService.name);

    constructor(
        @InjectModel(MenuItemModule.name)
        private menuItemModel: Model<MenuItemDocument>,
    
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

    async createReview(menuItemId: string, review: IReview): Promise<IMenuItem> {
        const existingMenuItem = await this.menuItemModel.findById(menuItemId).exec();
        
        if (!existingMenuItem) {
            throw new NotFoundException(`Menu item with id ${menuItemId} not found`);
        }
    
        // Add the review to the reviews array
        existingMenuItem.reviews.push(review);
    
        const updatedMenuItem = await existingMenuItem.save();
        return updatedMenuItem;
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