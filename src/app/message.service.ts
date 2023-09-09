import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * This service is used to display messages to the user via MatSnackbar.
 * It has a message property and two methods: add() and clear().
 * The message property is used to store the message to be displayed.
 *
 * This service runs autoniomously and is not injected into any other service.
 * It is injected into the product-dashboard component so that angular will still create it.
 * It subscribes to the productChangeEvent$ observable in the ProductService and displays a message to the user when the observable emits a value.
 * 
 */
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  message: string = ''; // The message to be displayed

  /**
   * Constructor
   * 
   * @param productService - Injects the ProductService
   * @param snackBar - Injects the MatSnackBar
   */
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

  // Helpers
  /**
   * Adds a message to the message property
   * @param message - The message to be displayed
   * @returns {void}
   */
  add(message: string): void {
    this.message = message;
  }

  /**
   * Clears the message property
   * @returns {void}
   */
  clear(): void {
    this.message = '';
  }

  /**
   * Opens a snackbar with the given message, action, duration, and panelClass
   * @param message - The message to be displayed
   * @param action - The action to be displayed
   * @param duration - The duration to be displayed
   * @param panelClass - The panelClass to be displayed
   * @returns {void}
   */
  openSnackBar(message: string, action: string, duration: number, panelClass : string): void {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: panelClass
    });
  }
}
