import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItemService } from '../menu-item.service';
import { IMenuItem } from '@herkansing-cswp/shared/api';
import { Subscription, switchMap, tap } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@herkansing-cswp/shared/util-env';

@Component({
    selector: 'stijns-burgers-menuitem-list',
    templateUrl: './menu-item-detail.component.html',
})
export class MenuItemDetailComponent implements OnInit, OnDestroy {
    menuitem: IMenuItem | null = null;
    subscription: Subscription | undefined = undefined;
    userNames = new Map<string, string>();
    constructor(private route: ActivatedRoute, private menuitemService: MenuItemService, private http: HttpClient) {}

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
    

