import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Input() product = {} as Product;
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();

  editProduct(product: Product) {
    // emit event
    this.edit.emit(product);
  }

  deleteProduct(product: Product) {
    // emit event
    this.delete.emit(product);
  }
}
