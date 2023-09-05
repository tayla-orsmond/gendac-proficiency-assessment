/* Service for managing products */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Product } from './product';
import { PRODUCTS } from './mock-products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}
  
  // TODO: Use API to get products

  getProducts(): Observable<Product[]> {
    const products = of(PRODUCTS);
    return products;
  }

  addProduct(product: Product): Observable<Product> {
    PRODUCTS.push(product);
    return of(product);
  }

  deleteProduct(product: Product): Observable<Product> {
    const index = PRODUCTS.findIndex((p) => p.id === product.id);
    PRODUCTS.splice(index, 1);
    return of(product);
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
