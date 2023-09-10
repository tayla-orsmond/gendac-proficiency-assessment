import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductDetailsComponent } from './product-details.component';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ProductDetailsComponent>>;
  const mockProductData: Product = {
    Id: 1,
    Name: 'Product ABC12345',
    Category: 1,
    Price: 99.99,
  };

  beforeEach(() => {
    productService = jasmine.createSpyObj('ProductService', ['addProduct', 'updateProduct']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ProductDetailsComponent],
      imports: [ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, BrowserAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockProductData },
      ],
    });

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the form with provided data in edit mode', () => {
    expect(component.isEdit).toBeTrue();
    expect(component.productForm.value).toEqual({
      Name: 'ABC12345',
      Category: 1,
      Price: 99.99,
    });
  });

  it('should reset the form and close the dialog when cancel is called', () => {
    component.cancel();
    expect(component.isEdit).toBeFalse();
    expect(component.productForm.value).toEqual({
      Name: null,
      Category: null,
      Price: null,
    });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should call ProductService.updateProduct when form is submitted in edit mode', () => {
    component.productForm.markAsDirty();
    component.submit();
    expect(productService.updateProduct).toHaveBeenCalledWith({
      Id: 1,
      Name: 'Product ABC12345',
      Category: 1,
      Price: 99.99,
    });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should call ProductService.addProduct when form is submitted in add mode', () => {
    component.isEdit = false;
    component.productForm.setValue({
        Name: 'ABC12345',
        Category: 1,
        Price: 99.99,
    });
    component.productForm.markAsDirty();
    component.submit();
    expect(productService.addProduct).toHaveBeenCalledWith({
      Id: 1,
      Name: 'Product ABC12345',
      Category: 1,
      Price: 99.99,
    });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not call ProductService.addProduct when form is submitted in add mode and form is invalid', () => {
    component.isEdit = false;
    component.productForm.setValue({
      Name: 'ABCDEF',
      Category: 1,
      Price: 99.99,
    });
    component.submit();
    expect(productService.addProduct).not.toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not call ProductService.updateProduct when form is submitted in edit mode and form is invalid', () => {
    component.productForm.setValue({
      Name: '',
      Category: 1,
      Price: 99.996,
    });
    component.submit();
    expect(productService.updateProduct).not.toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not call ProductService.updateProduct when form is submitted in edit mode and form is not dirty', () => {
    component.productForm.markAsPristine();
    component.submit();
    expect(productService.updateProduct).not.toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not call ProductService.addProduct when form is submitted in add mode and form is not dirty', () => {
    component.isEdit = false;
    component.productForm.markAsPristine();
    component.submit();
    expect(productService.addProduct).not.toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
