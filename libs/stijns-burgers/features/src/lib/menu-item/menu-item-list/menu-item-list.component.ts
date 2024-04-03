import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItemService } from '../menu-item.service';
import { IMenuItem } from '@herkansing-cswp/shared/api';
import { Observable, Subscription, of, switchMap } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from '@herkansing-cswp/auth';
@Component({
    selector: 'stijns-burgers-menuitem-list',
    templateUrl: './menu-item-list.component.html',
})
export class MenuItemListComponent implements OnInit, OnDestroy {
    menuitem: IMenuItem[] | null = null;
    subscription: Subscription | undefined = undefined;
    isAdmin$: Observable<boolean> | undefined;
    loading = true;
    constructor(private menuitemService: MenuItemService, private authService:AuthService) {
        this.isAdmin$ = this.authService.isAdmin$();
    }



      
  
    ngOnInit(): void {
      this.menuitemService.list().subscribe(
        data => {
          this.menuitem = data;
          console.log("Menuitems fetched for api:" + this.menuitem); // Log the data
        },
        error => console.error('Error:', error)
      );  }
    deleteMenuItem(menuitemId: string): void {
      if (confirm('Weet je zeker dat je deze sportclub wilt verwijderen?')) {
        this.menuitemService.delete(menuitemId).pipe(
          switchMap(() => {
            if (this.menuitem) {
              return of(this.menuitem.filter(menuitem => menuitem._id !== menuitemId));
            } else {
              return of([]); 
            }
          })
        ).subscribe(updatedMenuItem => {
          this.menuitem = updatedMenuItem;
          console.log(`Deleted sportclub with ID: ${menuitemId}`);
        }, error => {
          console.error(`Error deleting menuitem: ${error}`);
        });
      }
    }
  
    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
    getCurrentUserRole(): string {
      return this.authService.getCurrentUserRole();
    }
  
  }
  
