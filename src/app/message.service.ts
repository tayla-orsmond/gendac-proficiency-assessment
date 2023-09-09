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
    this.productService.productChangeEvent$.subscribe(() => {
      this.openSnackBar('Productlist updated!', '', 2000);
    });
  }

  add(message: string): void {
    this.message = message;
  }

  clear(): void {
    this.message = '';
  }

  openSnackBar(message: string, action: string, duration: number): void {
    this.snackBar.open(message, action, {
      duration: duration,
    });
  }
}
