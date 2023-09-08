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
  private productChangeEvent = new BehaviorSubject<Product[]>([]);
  private productEditEvent = new BehaviorSubject<Product>({} as Product);

  public productEditEvent$ = this.productEditEvent.asObservable();
  public productChangeEvent$ = this.productChangeEvent.asObservable();

  editProduct(product: Product): void {
    console.log("editProduct in product.service.ts, passing value", product, "updating productEditEvent");
    this.productEditEvent.next(product);
  }

  ngOnDestroy(): void {
    this.productEditEvent.complete();
    this.productChangeEvent.complete();
  }

  // TODO: Use API to get products

  getProducts(): Observable<Product[]> {
    /*
       courseId:number, filter = '', sortOrder = 'asc',
        pageNumber = 0, pageSize = 3):  Observable<Lesson[]> {

        return this.http.get(URL HERE, {
            params: new HttpParams()
                .set('courseId', courseId.toString())
                .set('filter', filter)
                .set('sortOrder', sortOrder)
                .set('pageNumber', pageNumber.toString())
                .set('pageSize', pageSize.toString())
        }).pipe(
            map(res =>  res["payload"])
        );
    */
    const products = of(PRODUCTS);
    return products;
  }

  addProduct(product: Product): void {
    console.log("addProduct in product.service.ts, passing value", product, "to PRODUCTS");
    PRODUCTS.push(product);
    this.productChangeEvent.next(PRODUCTS);
  }

  updateProduct(product: Product): void {
    console.log("updateProduct in product.service.ts, passing value", product, "to PRODUCTS");
    const index = PRODUCTS.findIndex((p) => p.id === product.id);
    PRODUCTS[index] = product;
    this.productChangeEvent.next(PRODUCTS);
  }

  deleteProduct(products: number[]): Observable<Product[]> {
    products.forEach((id) => {
      const index = PRODUCTS.findIndex((p) => p.id === id);
      PRODUCTS.splice(index, 1);
    });
    return of(PRODUCTS);
  }

  getProduct(id: number): Observable<Product> {
    const product = PRODUCTS.find((p) => p.id === id)!;
    return of(product);
  }
}
