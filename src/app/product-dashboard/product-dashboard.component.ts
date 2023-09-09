import { Component } from '@angular/core';
import { MessageService } from '../message.service';
/**
 * A dashboard component that displays a header and a product list.
 * The product list component is used to display the list of products, and handles most of the functionality.
 * The header component is used to display the header.
 * 
 * @constructor {MessageService} messageService - The message service, used to display confirmation messages
 */
@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss'],
})
export class ProductDashboardComponent {
  constructor(private messageService: MessageService) {}
  // MessageService is injected here even though it operates autonimously, just so that angular knows to create an instance of it.
}
