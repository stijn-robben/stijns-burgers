import { Id } from './id.type';
export interface ICartItem {
  _id: Id;
  menuItemId: Id;
  quantity: number;
  nameProduct: string;
  price: number;
  productImageUrl: string;
}

export class CartItem implements ICartItem {
  _id: Id;
  menuItemId: Id;
  quantity: number;
  nameProduct: string;
  price: number;
  productImageUrl: string;

  constructor(
    _id: Id,
    menuItemId: Id,
    quantity: number,
    nameProduct: string,
    price: number,
    productImageUrl: string
  ) {
    this._id = _id;
    this.menuItemId = menuItemId;
    this.quantity = quantity;
    this.nameProduct = nameProduct;
    this.price = price;
    this.productImageUrl = productImageUrl;
  }
}

export type ICreateCartItem = Pick<
  ICartItem,
   'menuItemId' | 'quantity' | 'nameProduct' | 'price' | 'productImageUrl'
>;
export type IUpdateCartItem = Partial<Omit<ICartItem, 'id'>>;
export type IUpsertCartItem = ICartItem;
