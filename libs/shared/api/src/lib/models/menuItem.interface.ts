import { Id } from './id.type';
import { IReview } from './review.interface';

export interface IMenuItem {
    _id: Id;
    item_type: string;
    description: string;
    name: string;
    price: number;
    ingredients: string[];
    allergens: string[];
    img_url: string;
    reviews: IReview[];
}

export type ICreateMenuItem = Pick<
    IMenuItem,
    'name' | 'description' | 'price' | 'item_type' | 'ingredients' | 'allergens'
>;
export type IUpdateMenuItem = Partial<Omit<IMenuItem, 'id'>>;
export type IUpsertMenuItem = IMenuItem;