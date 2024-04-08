import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MenuItemListComponent } from './menu-item/menu-item-list/menu-item-list.component';
import { MenuItemService } from './menu-item/menu-item.service';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './homepage/home.component';
import { MenuItemDetailComponent } from './menu-item/menu-item-detail/menu-item-detail.component';
import { MenuItemEditComponent } from './menu-item/menu-item-edit/menu-item-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MenuItemNewReviewComponent } from './menu-item/menu-item-new-review/menu-item-new-review.component';
import { CartService } from './cart/cart.service';
import { CartComponent } from './cart/cart.component';
@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule, MatFormFieldModule, MatChipsModule],
  declarations: [
    HomeComponent,
    MenuItemListComponent,
    MenuItemDetailComponent,
    MenuItemEditComponent,
    MenuItemNewReviewComponent,
    CartComponent
  ],
  providers: [MenuItemService, CartService],
  exports: [
    HomeComponent,
    MenuItemListComponent,
    MenuItemDetailComponent,
    MenuItemEditComponent,
    MenuItemNewReviewComponent,
    CartComponent
  ],
})
export class FeaturesModule {}