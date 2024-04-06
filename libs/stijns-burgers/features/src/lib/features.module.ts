import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MenuItemListComponent } from './menu-item/menu-item-list/menu-item-list.component';
import { MenuItemService } from './menu-item/menu-item.service';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './homepage/home.component';
import { MenuItemDetailComponent } from './menu-item/menu-item-detail/menu-item-detail.component';
@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  declarations: [
    HomeComponent,
    MenuItemListComponent,
    MenuItemDetailComponent
  ],
  providers: [MenuItemService],
  exports: [
    HomeComponent,
    MenuItemListComponent,
    MenuItemDetailComponent
  ],
})
export class FeaturesModule {}