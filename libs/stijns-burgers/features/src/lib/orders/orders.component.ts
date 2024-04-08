import { Component, OnInit } from '@angular/core';
import { OrdersService, IOrderWithUser } from './orders.service';
import { IOrder } from '@herkansing-cswp/shared/api';

@Component({
  selector: 'stijns-burgers-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  orders: IOrderWithUser[] = [];

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.ordersService.getAllOrders().then(orders => {
      this.orders = orders;
    });
  }
}