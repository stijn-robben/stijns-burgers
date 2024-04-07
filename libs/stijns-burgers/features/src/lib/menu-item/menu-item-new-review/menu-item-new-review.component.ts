import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItemService } from '../menu-item.service';
import { AuthService } from '@herkansing-cswp/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IReview } from '@herkansing-cswp/shared/api';

@Component({
  selector: 'stijns-burgers-menu-item-new-review',
  templateUrl: './menu-item-new-review.component.html',
})
export class MenuItemNewReviewComponent implements OnInit, OnDestroy {
  review: IReview = {
    _id: '',
    _id_user: '',
    description: '',
    score: 0
  };
  private destroy$ = new Subject<void>();
  private menuItemId: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private menuitemService: MenuItemService, 
    private authService: AuthService,
    private router: Router

  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.menuItemId = id;
    } else {
      // Handle the case where id is null or undefined
      console.error('ID is not defined');
    }  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  save() {
    if (!this.menuItemId) {
      console.error('Menu item ID is not defined');
      return;
    }
  
  
    this.menuitemService.createReview(this.menuItemId, this.review)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        console.log(response);
        this.review = {_id: '', _id_user: this.review._id_user, description: '', score: this.review.score};      });
        this.router.navigate(['/menu/' + this.menuItemId]);

  }
  
  cancel() {
    this.router.navigate(['/menu/' + this.menuItemId]);
  }}