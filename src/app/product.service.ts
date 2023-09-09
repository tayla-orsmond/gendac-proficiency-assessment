import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from './product';

/**
 * This service is used to get, add, update, and delete products.
 * It handles all http requests to the API.
 * It has a productChangeEvent$ observable that is used to notify the message service and product-list component when a product is added, or updated.
 *
 * This service is injected into the product-list component, product-detail component, and message service.
 */

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productChangeEvent = new BehaviorSubject<string>('');
  public productChangeEvent$ = this.productChangeEvent.asObservable(); // Observable used to notify the message service and product-list component when a product is added, or updated.

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private productsUrl =
    'https://gendacproficiencytest.azurewebsites.net/API/ProductsAPI/';
  //GET api/ProductsAPI
  //GET api/ProductsAPI?page={page}&pageSize={pageSize}&orderBy={orderBy}&ascending={ascending}&filter={filter}
  //GET api/ProductsAPI/{id}
  //POST api/ProductsAPI
  //PUT api/ProductsAPI/{id}
  //DELETE api/ProductsAPI/{id}

  constructor(private http: HttpClient) {}

  // Lifecycle Hooks
  ngOnDestroy(): void {
    this.productChangeEvent.complete();
  }

  // Methods

  /**
   * Gets products from the API
   *
   * @param filter - The filter to be applied to the products (default: '')
   * @param ascending - Whether or not the products should be sorted in ascending order (default: true)
   * @param page - The page of products to be fetched (default: 0)
   * @param pageSize - The number of products to be fetched (default: 10)
   * @param orderBy - The field to order the products by (default: 'id')
   * @returns {Observable<Product[]>} - An observable of the products
   */
  getProducts(
    filter: string = '',
    ascending: boolean = true,
    page: number = 0,
    pageSize: number = 10,
    orderBy: string = 'id'
  ): Observable<Product[]> {
    return this.http
      .get<Product[]>(
        this.productsUrl +
          '?filter=' +
          filter +
          '&ascending=' +
          ascending +
          '&page=' +
          page +
          '&pageSize=' +
          pageSize +
          '&orderBy=' +
          orderBy
      )
      .pipe(map((res: { [x: string]: any }) => res['Results'])); // The API returns an object with a Results property that contains the products
  }

  /**
   * Posts a product to the API
   *
   * @param product - The product to be added
   * @returns {void}
   */
  addProduct(product: Product): void {
    this.http
      .post<Product>(this.productsUrl, product, this.httpOptions)
      .pipe(
        catchError((err) => {
          this.productChangeEvent.next('error: ' + err.message);
          return of(err);
        })
      )
      .subscribe((product) => {
        this.productChangeEvent.next('add');
      });
  }

  /**
   * Puts a product to the API
   *
   * @param product - The product to be updated
   * @returns {void} (Uses the productChangeEvent$ observable to notify observers when a product is added, or updated)
   */
  updateProduct(product: Product): void {
    this.http
      .put<Product>(this.productsUrl + product.Id, product, this.httpOptions)
      .pipe(
        catchError((err) => {
          this.productChangeEvent.next('error: ' + err.message);
          return of(err);
        })
      )
      .subscribe((product) => {
        this.productChangeEvent.next('update');
      });
  }

  /**
   * Deletes a product from the API
   *
   * @param products - The products to be deleted
   * @returns {Observable<Product[]>} - An empty observable of products
   */
  deleteProduct(products: number[]): Observable<Product[]> {
    products.forEach((id) => {
      setTimeout(() => {
        this.http
          .delete<Product>(this.productsUrl + id, this.httpOptions)
          .subscribe((product) => {});
      }, 100);
    });
    return of([] as Product[]);
  }

  /**
   * Gets a product from the API
   *
   * @param id - The id of the product to be fetched
   * @returns {Observable<Product>} - An observable of the product
   */
  getProduct(id: number): Observable<Product> {
    // make http request to get product
    return this.http.get<Product>(this.productsUrl + id);
  }
}
