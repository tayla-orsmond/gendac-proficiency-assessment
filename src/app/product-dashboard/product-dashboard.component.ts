import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss'],
})
export class ProductDashboardComponent { // a dashboard component that displays the product list, product details, and product add/edit form
  constructor(private messageService : MessageService) { }

  openSnackBar(message: string, action: string, duration : number): void {
    this.messageService.openSnackBar(message, action, duration);
  }
}
