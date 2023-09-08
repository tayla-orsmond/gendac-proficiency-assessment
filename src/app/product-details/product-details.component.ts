import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  // form for adding and editing products (name, category, price) - make sure to validate
  @Input() activeEditProduct?: Product;
  isEdit: boolean = false;
  formVisible: boolean = false;
  productForm = new FormGroup(
    {
      name: new FormControl(this.activeEditProduct?.name.split(' ')[1] ?? '', [
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(/^[a-zA-Z]{3}[\d]{5}$/),
        Validators.required
      ]),
      category: new FormControl(this.activeEditProduct?.category ?? 1, [
        Validators.minLength(1),
        Validators.pattern(/^[\d]$/),
        Validators.required
      ]),
      price: new FormControl(this.activeEditProduct?.price ?? '', [
        Validators.minLength(1),
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
        Validators.required
      ]),
    }
  );

  constructor(private productService: ProductService) {}

  // Lifecycle Hooks
  ngOnInit(): void {
    this.productService.productEditEvent$.subscribe((product) => {
      this.activeEditProduct = product;
      this.populateForm();
    });
    this.formVisible = false;
  }

  // Helpers
  populateForm(): void {
    this.productForm.setValue({
      name: this.activeEditProduct?.name
        ? this.activeEditProduct?.name.split(' ')[1].toUpperCase()
        : '',
      category: this.activeEditProduct?.category ?? 1,
      price: this.activeEditProduct?.price ?? '',
    });
    if(this.activeEditProduct?.name) { // if product name exists (i.e., editing existing product), then form is in edit mode
      this.isEdit = true;
    }
    this.formVisible = true;
  }

  // Events
  submit(): void {
    if (this.activeEditProduct && this.productForm.valid && this.productForm.dirty) {
      const product: Product = {
        id: this.activeEditProduct.id ?? 0,
        name: 'Product ' + (this.productForm.value.name?.toUpperCase() ?? ''),
        category: (this.productForm.value.category as number) ?? 0,
        price: (this.productForm.value.price as number) ?? 0.0,
      };
      if (this.isEdit) {
        this.productService.updateProduct(product);
      } else {
        this.productService.addProduct(product);
      }
      this.cancel(); // close form and reset
    }
  }

  cancel(): void {
    this.activeEditProduct = {} as Product;
    this.productForm.reset();
    this.isEdit = false;
    this.formVisible = false;
  }
}
