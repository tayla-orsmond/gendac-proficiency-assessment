import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  @Input() product?: Product;
  @Input() isEdit: boolean = false;
  @Output() addProduct = new EventEmitter<Product>();
  @Output() editProduct = new EventEmitter<Product>();
  @Output() cancelEdit = new EventEmitter<void>();

  productForm = new FormGroup({
    name: new FormControl(this.product?.name.split(' ')[1] ?? '', [
      Validators.minLength(8),
      Validators.maxLength(12),
      Validators.pattern(/^[A-Z]{3}[\d]{5,}$/)
    ]),
    category: new FormControl(this.product?.category ?? 1, [
      Validators.minLength(1),
      Validators.pattern(/^[\d]$/)
    ]),
    price: new FormControl(this.product?.price ?? '', [
      Validators.minLength(1),
      Validators.pattern(/^\d+(\.\d{1,2})?$/)
    ]),
  }, Validators.required);

  constructor() {}

  ngOnChanges() {
    this.productForm.setValue({
      name: this.product?.name.split(' ')[1] ?? '',
      category: this.product?.category ?? 1,
      price: this.product?.price ?? '',
    });
  }

  // Events
  submit(): void {
    if (this.product && this.productForm.valid) {
      const product: Product = {
        id: this.product.id ?? 0,
        name: 'Product ' + (this.productForm.value.name ?? ''),
        category: (this.productForm.value.category as number) ?? 0,
        price: (this.productForm.value.price as number) ?? 0.0,
      };
      if (this.isEdit) {
        this.editProduct.emit(product);
      } else {
        this.addProduct.emit(product);
      }
      this.productForm.reset();
      this.product = {} as Product;
    }
  }

  cancel(): void {
    this.cancelEdit.emit();
    this.product = {} as Product;
  }
}
