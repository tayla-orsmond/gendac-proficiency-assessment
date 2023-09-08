import { Component } from '@angular/core';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss'],
  providers: [ProductService],
})
export class ProductDashboardComponent { // a dashboard component that displays the product list, product details, and product add/edit form
  constructor() { }
}
