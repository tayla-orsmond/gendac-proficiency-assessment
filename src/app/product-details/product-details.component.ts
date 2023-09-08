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
      Name: new FormControl(this.activeEditProduct?.Name.split(' ')[1] ?? '', [
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(/^[a-zA-Z]{3}[\d]{5}$/),
        Validators.required
      ]),
      Category: new FormControl(this.activeEditProduct?.Category ?? 1, [
        Validators.minLength(1),
        Validators.pattern(/^[\d]$/),
        Validators.required
      ]),
      Price: new FormControl(this.activeEditProduct?.Price ?? '', [
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
      console.log("product-details.component.ts: productEditEvent$ subscription, product:", product);
    });
    this.formVisible = false;
  }

  // Helpers
  populateForm(): void {
    this.productForm.setValue({
      Name: this.activeEditProduct?.Name
        ? this.activeEditProduct?.Name.split(' ')[1].toUpperCase()
        : '',
      Category: this.activeEditProduct?.Category ?? 1,
      Price: this.activeEditProduct?.Price ?? '',
    });
    if(this.activeEditProduct?.Name) { // if product name exists (i.e., editing existing product), then form is in edit mode
      this.isEdit = true;
    }
    this.formVisible = true;
  }

  // Events
  submit(): void {
    if (this.activeEditProduct && this.productForm.valid && this.productForm.dirty) {
      const product: Product = {
        Id: this.activeEditProduct.Id ?? 0,
        Name: 'Product ' + (this.productForm.value.Name?.toUpperCase() ?? ''),
        Category: (this.productForm.value.Category as number) ?? 0,
        Price: (this.productForm.value.Price as number) ?? 0.0,
      };
      if (this.isEdit) {
        console.log("product-details.component.ts: submit() - calling productService.updateProduct() with product:", product);
        this.productService.updateProduct(product);
      } else {
        console.log("product-details.component.ts: submit() - calling productService.addProduct() with product:", product);
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
