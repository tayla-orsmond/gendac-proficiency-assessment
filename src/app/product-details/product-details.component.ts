import { Component, Input, EventEmitter, Output} from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  @Input() product ?: Product;
  @Input() isEdit = false;
  @Output() addProduct = new EventEmitter<Product>();
  @Output() editProduct = new EventEmitter<Product>();

  constructor() { }

  add(): void {
    this.addProduct.emit(this.product);
    this.product = {} as Product;
    this.isEdit = false;
  }

  update(): void {
    this.editProduct.emit(this.product);
    this.product = {} as Product;
    this.isEdit = false;
  }

  cancel(): void {
    this.product = {} as Product;
    this.isEdit = false;
  }
}
