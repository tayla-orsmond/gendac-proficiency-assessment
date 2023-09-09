/* Service for managing products */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Editing a product - passing data between product component and product-detail form component
  private productChangeEvent = new BehaviorSubject<Product>({} as Product);
  public productChangeEvent$ = this.productChangeEvent.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private productsUrl = 'https://gendacproficiencytest.azurewebsites.net/API/ProductsAPI/';
  //GET api/ProductsAPI
  //GET api/ProductsAPI?page={page}&pageSize={pageSize}&orderBy={orderBy}&ascending={ascending}&filter={filter}
  //GET api/ProductsAPI/{id}
  //POST api/ProductsAPI
  //PUT api/ProductsAPI/{id}
  //DELETE api/ProductsAPI/{id}

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.productChangeEvent.complete();
  }

  // TODO: Use API to get products

  getProducts(
    filter: string = '',
    ascending: boolean = true,
    page: number = 0,
    pageSize: number = 10,
    orderBy: string = 'id'
  ): Observable<Product[]> {
    // make http request to get products
    // add extra filter handling for if filterBy is not 'none'
    return this.http.get<Product[]>(this.productsUrl + '?filter=' + filter + '&ascending=' + ascending + '&page=' + page + '&pageSize=' + pageSize + '&orderBy=' + orderBy).pipe(map((res: { [x: string]: any; }) => res['Results']));
  }

  addProduct(product: Product): void {
    // make http request to add product
    this.http.post<Product>(this.productsUrl, product, this.httpOptions).subscribe((product) => {
      console.log('addProduct in product.service.ts, passing value', product, 'to PRODUCTS');
      this.productChangeEvent.next(product);
    });
  }

  updateProduct(product: Product): void {
    // make http request to update product
    this.http.put<Product>(this.productsUrl + product.Id, product, this.httpOptions).subscribe((product) => {
      console.log('updateProduct in product.service.ts, passing value', product, 'to PRODUCTS');
      this.productChangeEvent.next(product);
    });
  }

  deleteProduct(products: number[]): Observable<Product[]> {
    products.forEach((id) => {
      // make http request to delete product
      setTimeout(() => {
        this.http.delete<Product>(this.productsUrl + id, this.httpOptions).subscribe((product) => {
          console.log('deleteProduct in product.service.ts, passing value', product, 'to PRODUCTS');
        });
      }, 100);
    });
    return of([] as Product[]);
  }

  getProduct(id: number): Observable<Product> {
    // make http request to get product
    return this.http.get<Product>(this.productsUrl + id);
  }
}
