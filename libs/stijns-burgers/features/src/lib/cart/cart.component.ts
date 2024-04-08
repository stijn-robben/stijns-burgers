import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICartItem, IMenuItem } from '@herkansing-cswp/shared/api';
import { Subscription, catchError, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '@herkansing-cswp/auth';
import { CartService } from './cart.service';

@Component({
  selector: 'stijns-burgers-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
    cartItems: ICartItem[] = []; // Initialize cartItems as an empty array
    total = 0; // Initialize total as 0
  
    constructor(
      private cartService: CartService, // Inject the service
      private router: Router
    ) { }
    

    ngOnInit(): void {
      this.cartService.getCartItems().subscribe(cartItems => {
        this.cartItems = cartItems;
        this.calculateTotal();
      });
    }

    calculateTotal(): void {
        const total = this.cartItems.reduce((acc, item) => acc + (item.price), 0);
        this.total = parseFloat(total.toFixed(2));
    }

    makeOrder(): void {
      this.cartService.makeOrder().subscribe(
        
      );
      this.router.navigate(['/']);
    }
  

    deleteCartItem(cartItemId: string): void {
      // Find the item in the cartItems array
      const cartItem = this.cartItems.find(item => item._id === cartItemId);
      if (cartItem) {
          if (cartItem.quantity > 1) {
              // If the quantity is more than 1, decrease it by 1
              this.cartService.updateCartItem(cartItemId, cartItem.quantity - 1).subscribe(response => {

                  // Update the quantity of the item in the cartItems array
                  cartItem.quantity -= 1;
                  cartItem.price = parseFloat((cartItem.price / (cartItem.quantity + 1)).toFixed(2));
                  this.calculateTotal(); // Recalculate the total
              }, error => console.error(error));
          } else {
              // If the quantity is 1, delete the item
              this.cartService.deleteCartItem(cartItemId).subscribe(response => {
                  if (response.deleted) {
                      // If the item was successfully deleted, remove it from the cartItems array
                      this.cartItems = this.cartItems.filter(item => item._id !== cartItemId);
                      this.calculateTotal(); // Recalculate the total
                  } else {
                      console.error(response.message);
                  }
              }, error => console.error(error));
          }
      }
  }
}