import { Component, OnInit, OnDestroy } from '@angular/core';
import { IMenuItem } from '@herkansing-cswp/shared/api';
import { MenuItemService } from '../menu-item.service';
import { Subscription, catchError, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '@herkansing-cswp/auth';

@Component({
  selector: 'stijns-burgers-menu-item-list',
  templateUrl: './menu-item-edit.component.html',
})
export class MenuItemEditComponent implements OnInit, OnDestroy {
  menuitem: IMenuItem = {
    item_type: '',
    description: '',
    name: '',
    price: 0,
    ingredients: [],
    allergens: [],
    img_url: '',
    reviews: [],
    _id: '',
  };
  routeUrl = '';
  imageError = false;
  subscription: Subscription | undefined;

  constructor(
    private menuitemService: MenuItemService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeUrl = this.route.snapshot.url.join('');
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      // We are editing an existing item
      this.subscription = this.menuitemService.read(itemId).subscribe(
        data => {
          this.menuitem = data;
        },
        error => console.error('Error:', error)
      );
    }
    // If we are creating a new item, menuitem will remain as the empty object
  }

   initializeNewMenuItem(): void {
    this.menuitem = {
      item_type: '',
      description: '',
      name: '',
      price: 0,
      ingredients: [''],
            allergens: [''],
      img_url: '',
    reviews: [],
    _id: '',
    };
    console.log('Setting up new user template');
  }

  public onImageError(): void {
    this.imageError = true;
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }  
  
  
  private convertToJson(): string {
    if (this.menuitem) {
      return JSON.stringify(this.menuitem);
    } else {
      return JSON.stringify({});
    }
  }

  public updateImageUrl(newUrl: string): void {
    if (this.menuitem) {
      this.menuitem.img_url = newUrl;
    }
    this.imageError = false;
  }  
  
  save() {
    console.log('Hier komt de save actie');
    const jsonText = JSON.stringify(this.menuitem);
    console.log('JSON Text:', jsonText);
    console.log('Route URL:', this.routeUrl)
    
    if (this.routeUrl.includes('new')) {
      console.log('Creating new menuitem');
      const { _id, ...menuitemWithoutId } = this.menuitem; // remove _id from the menuitem object
      const jsonText = JSON.stringify(menuitemWithoutId);
      console.log('JSON Text:', jsonText);
      this.menuitemService.createMenuItem(JSON.parse(jsonText)).subscribe(createMenuItem => {
        this.router.navigate(['/menu/' + createMenuItem._id]);
      });
    }
     else if (this.routeUrl.includes('edit') && this.menuitem && this.menuitem._id) {
      console.log('Updating menuitem');
      this.menuitemService.updateMenuItem(this.menuitem._id, JSON.parse(jsonText)).subscribe(updatedMenuItem => {
        console.log('Updated menuitem:', updatedMenuItem);
        this.router.navigate(['/menu/' + this.menuitem._id]);
      });
    }
  }

  cancel() {
    this.router.navigate(['/menu']);
  }
}


  
  


