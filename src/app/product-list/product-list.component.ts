import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  constructor() {}
  //make sure products are displayed as a list, and handle sort and filter accordingly (also select all) and have a search bar
  @Input() products: Product[] = [];
  @Output() selectedProducts: EventEmitter<number> = new EventEmitter<number>();

  selectProduct(pID: number): void {
    this.selectedProducts.emit(pID);
  }  
}
