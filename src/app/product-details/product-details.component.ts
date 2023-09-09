import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  // form for adding and editing products (name, category, price) - make sure to validate
  isEdit: boolean = false;
  productForm = new FormGroup(
    {
      Name: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(/^[a-zA-Z]{3}[\d]{5}$/),
        Validators.required
      ]),
      Category: new FormControl(1, [
        Validators.minLength(1),
        Validators.pattern(/^[\d]$/),
        Validators.required
      ]),
      Price: new FormControl(0.00, [
        Validators.minLength(1),
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
        Validators.required
      ]),
    }
  );

  constructor(private productService: ProductService, public dialogRef : MatDialogRef<ProductDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product) {}

  // Lifecycle Hooks
  ngOnInit(): void {
    this.populateForm();
    this.dialogRef.disableClose = true; // prevent closing dialog when clicking outside of it
  }

  // Helpers
  populateForm(): void {
    this.productForm.setValue({
      Name: this.data?.Name
        ? this.data?.Name.split(' ')[1].toUpperCase()
        : '',
      Category: this.data?.Category ?? 1,
      Price: this.data?.Price ?? '',
    });
    if(this.data?.Name) { // if product name exists (i.e., editing existing product), then form is in edit mode
      this.isEdit = true;
    }
  }

  // Events
  submit(): void {
    if (this.data && this.productForm.valid && this.productForm.dirty) {
      const product: Product = {
        Id: this.data.Id ?? 0,
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
    this.productForm.reset();
    this.isEdit = false;
    this.dialogRef.close();
  }
}
