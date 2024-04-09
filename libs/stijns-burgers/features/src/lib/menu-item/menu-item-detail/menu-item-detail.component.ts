import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItemService } from '../menu-item.service';
import { ICartItem, IMenuItem } from '@herkansing-cswp/shared/api';
import { Observable, Subscription, switchMap, tap } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@herkansing-cswp/shared/util-env';
import { AuthService } from '@herkansing-cswp/auth';

@Component({
    selector: 'stijns-burgers-menuitem-list',
    templateUrl: './menu-item-detail.component.html',
})
export class MenuItemDetailComponent implements OnInit, OnDestroy {
    menuitem: IMenuItem | null = null;
    subscription: Subscription | undefined = undefined;
    userNames = new Map<string, string>();
    constructor(private route: ActivatedRoute, private menuitemService: MenuItemService, private http: HttpClient, private authService: AuthService) {}

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.menuitemService.read(id).subscribe((results: IMenuItem) => {
          this.menuitem = results;
          console.log('results', this.menuitem);
    
          // Fetch the user's name
          if (this.menuitem && this.menuitem.reviews) {
            this.menuitem.reviews.forEach(review => {
              if (review._id_user) {
                this.http.get(`${environment.dataApiUrl}/user/${review._id_user}/name`, {responseType: 'text'}).subscribe(name => {
                  this.userNames.set(review._id_user, name);
                });              }
            });
          }        });
      });
    }
    
    isAdmin$(): Observable<boolean> {
      return this.authService.isAdmin()
        .pipe(
          tap(isAdmin => console.log('User is admin:', isAdmin))
        );
    }
    
    isLoggedIn(): boolean {
      console.log('check' + this.authService.checkUserAuthentication())
      return this.authService.checkUserAuthentication();
    }


    addToCart(menuItemId: string, nameProduct: string, price: number, productImageUrl: string): void {
      const cartItem: ICartItem = {
        _id: '',
        menuItemId,
        quantity: 1,
        nameProduct,
        price,
        productImageUrl
      };
    
      if (this.menuitem && this.menuitem._id) {
        this.menuitemService.addToCart(cartItem)
          .subscribe(user => {
            console.log('Added to cart:', user);
          }, error => {
            console.error('Error adding to cart:', error);
          });
      } else {
        console.error('Menu item or menu item ID is undefined');
      }
    }

    updateCurrentMenuItem(data: any): void {
      if (this.menuitem && this.menuitem._id) {
        this.menuitemService.updateMenuItem(this.menuitem._id, data)
          .subscribe(updatedMenuItem => {
            console.log('Updated menu item:', updatedMenuItem);
            // Update the local menuitem with the updated data
            this.menuitem = updatedMenuItem;
          }, error => {
            console.error('Error updating menu item:', error);
          });
      } else {
        console.error('Menu item or menu item ID is undefined');
      }
    }
    
    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

    replaceArrayCommasWithSpaces(t: string[] | undefined | null): string {
      if (!t) {
        return '';
      }
    
      return t.join(', ').replace(/,/g, ', ');
    }

    allergenSymbols: { [key: string]: string } = {
      'dairy': '🧀',
      'wheat': '🌾',
      'egg': '🥚',
      // Add more allergens and their corresponding symbols as needed
    };

    replaceAllergensWithSymbols(allergens: string[] | undefined | null): string {
      if (!allergens) {
        return '';
      }
  
      return allergens.map(allergen => this.allergenSymbols[allergen] || allergen).join(', ');
    }
  }  
    

