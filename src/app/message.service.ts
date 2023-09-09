import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductService } from './product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  message: string = '';

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {
    this.productService.productChangeEvent$.subscribe((res) => {
      if(res === 'add') {
        this.openSnackBar('Product added Successfully!', '', 2000, '.success-snackbar');
      }
      else if(res === 'update') {
        this.openSnackBar('Product updated Successfully!', '', 2000, '.success-snackbar');
      }
      else if(res === '') {
        this.openSnackBar('Products loaded Successfully!', '', 2000, '.success-snackbar');
      } else if (res.includes('error')) {
        this.openSnackBar(res, '', 2000, '.error-snackbar');
      }
    });
  }

  add(message: string): void {
    this.message = message;
  }

  clear(): void {
    this.message = '';
  }

  openSnackBar(message: string, action: string, duration: number, panelClass : string): void {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: panelClass
    });
    console.log('openSnackBar in message.service.ts, passing value', message, 'to PRODUCTS');
  }
}
