import { Component, OnInit } from '@angular/core';
import { OrdersService, IOrderWithUser } from './orders.service';
import { IOrder } from '@herkansing-cswp/shared/api';

@Component({
  selector: 'stijns-burgers-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  orders: IOrderWithUser[] = [];
  editMode = false;

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.ordersService.getAllOrders().then(orders => {
      this.orders = orders;
    });
  }

  updateOrderStatus(order: IOrderWithUser, newStatus: string) {
    this.ordersService.updateOrderStatus(order._id_user, order._id, newStatus)
      .then(updatedUser => {
        if (updatedUser) {
          // Find the updated order in this.orders and update it
          const updatedOrder = updatedUser.orders.find(o => o._id === order._id);
          if (updatedOrder) {
            const orderIndex = this.orders.findIndex(o => o._id === order._id);
            if (orderIndex !== -1) {
              this.orders[orderIndex] = updatedOrder;
            }
          }
        }
        this.ordersService.getAllOrders().then(orders => {
          this.orders = orders;
        });
    
      })
      .catch(error => {
        console.error('Failed to update order status:', error);
      });
  }
  
  deleteOrder(order: IOrderWithUser) {
    this.ordersService.deleteOrder(order._id_user, order._id)
      .then(updatedUser => {
        if (updatedUser) {
          // Remove the deleted order from this.orders
          this.orders = this.orders.filter(o => o._id !== order._id);
        }
      })
      .catch(error => {
        console.error('Failed to delete order:', error);
      });
  }
}

