import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent { // display product details and emit events when user interacts with the component
  @Input() product = {} as Product;
  @Output() toggleSelect = new EventEmitter<number>();

  constructor(private productService: ProductService) { }

  editProduct() {
    // use service to edit product
    // this.productService.editProduct(this.product);
  }

  toggleProductSelect() {
    // emit event
    this.toggleSelect.emit(this.product.Id);
  }
}
