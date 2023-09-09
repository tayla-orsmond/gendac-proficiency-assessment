import { Component } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss'],
})
export class ProductDashboardComponent { // a dashboard component that displays the product list, product details, and product add/edit form
  constructor(private messageService : MessageService) { }
}
