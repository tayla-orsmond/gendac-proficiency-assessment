import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
/**
 * A dialog component that displays a form for adding or editing a product.
 * The same component is used for both adding and editing, and is passed a product object to edit.
 * Used by the product list component to add or edit a product, but is generic enough to be used anywhere.
 * Once the form is submitted, the product is added or edited using the product service.
 * The form is validated using angular's built-in validators.
 * The form is reset and closed when the cancel button is clicked.
 */

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  isEdit: boolean = false; // whether the form is in edit mode or not (i.e., whether the form is used for adding or editing a product)
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
  /**
   * Populates the form with the product data.
   * If the product data is null, then the form is in add mode.
   * If the product data is not null, then the form is in edit mode.
   */
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
  /**
   * Submits the form data to the product service.
   * If the form is in edit mode, then the product is updated.
   * If the form is in add mode, then the product is added.
   * The form is reset and closed afterwards via the cancel method.
   * The form is not submitted if the form is invalid or the form is not dirty.
   */
  submit(): void {
    if (this.data && this.productForm.valid && this.productForm.dirty) {
      const product: Product = { // create product object from form data
        Id: this.data.Id as number ?? 0,
        Name: 'Product ' + (this.productForm.value.Name?.toUpperCase() as string ?? ''),
        Category: (this.productForm.value.Category as number) ?? 1,
        Price: (this.productForm.value.Price as number) ?? 0.0,
      };
      if (this.isEdit) {
        this.productService.updateProduct(product);
      } else {
        this.productService.addProduct(product);
      }
      this.cancel(); // close form and reset
    }
  }

  /**
   * Resets the form and closes the dialog.
   * Called when the cancel button is clicked.
   */
  cancel(): void {
    this.productForm.reset();
    this.isEdit = false;
    this.dialogRef.close();
  }
}
