import { Component, Input, EventEmitter, Output} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  @Input() product ?: Product;
  @Input() isEdit : boolean = false;
  @Output() addProduct = new EventEmitter<Product>();
  @Output() editProduct = new EventEmitter<Product>();
  @Output() cancelEdit = new EventEmitter<void>();

  productForm = new FormGroup({
    name: new FormControl(this.product?.name ?? '', [Validators.minLength(4)]),
    category: new FormControl(this.product?.category ?? ''),
    price: new FormControl(this.product?.price ?? '')
  }, Validators.required);

  constructor() { }

  ngOnChanges(){
    this.productForm.setValue({
      name: this.product?.name ?? '',
      category: this.product?.category ?? '',
      price: this.product?.price ?? '',
    })
  }

  // Events
  submit() : void {
    if (this.product && this.productForm.valid) {
      const product: Product = {
        id: this.product.id ?? 0,
        name: this.productForm.value.name ?? '',
        category: this.productForm.value.category as number ?? 0,
        price: this.productForm.value.price as number ?? 0.00
      }
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
