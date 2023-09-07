/* Service for managing products */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Product } from './product';
import { PRODUCTS } from './mock-products';

@Injectable({
  providedIn: 'root',
})

export class ProductService {
  // Editing a product - passing data between product component and product-detail form component 
  private productEditEvent = new BehaviorSubject<Product>({} as Product)
  private productEditObservable = this.productEditEvent.asObservable();

  editProduct(product: Product): void {
    this.productEditEvent.next(product);
  }

  editProductEventListener(): Observable<Product> {
    return this.productEditObservable;
  }

  ngOnDestroy(): void {
    this.productEditEvent.unsubscribe();
  }

  // TODO: Use API to get products

  getProducts(): Observable<Product[]> {
    const products = of(PRODUCTS);
    return products;
  }

  addProduct(product: Product): Observable<Product> {
    PRODUCTS.push(product);
    return of(product);
  }

  deleteProduct(products: number[]): Observable<number[]> {
    products.forEach((id) => {
      const index = PRODUCTS.findIndex((p) => p.id === id);
      PRODUCTS.splice(index, 1);
    });
    return of(products);
  }

  updateProduct(product: Product): Observable<Product> {
    const index = PRODUCTS.findIndex((p) => p.id === product.id);
    PRODUCTS[index] = product;
    return of(product);
  }

  getProduct(id: number): Observable<Product> {
    const product = PRODUCTS.find((p) => p.id === id)!;
    return of(product);
  }
}
