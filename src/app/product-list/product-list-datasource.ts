import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, of as observableOf, BehaviorSubject } from 'rxjs';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class ProductListDataSource extends DataSource<Product> {
  paginator!: MatPaginator;
  sort!: MatSort;
  private productSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private productListLengthSubject = new BehaviorSubject<number>(0);

  public product$ = this.productSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public length$ = this.productListLengthSubject.asObservable();

  constructor(private productService: ProductService) {
    super();
    this.productService.productChangeEvent$.subscribe((products) => {
      this.loadProducts();
      console.log("product-list-datasource.ts: productChangeEvent$ subscription, products:", products);
    });
  }

  connect(collectionViewer: CollectionViewer): Observable<Product[]> {
    return this.productSubject.asObservable();
  }

  disconnect(): void {
    this.productSubject.complete();
    this.loadingSubject.complete();
    this.productListLengthSubject.complete();
  }

  public loadProducts(): void {
    // TODO: Use API to get products
    this.productService
      .getProducts()
      .pipe(
        catchError(() => observableOf([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.productSubject.next(this.productSubject.value);
          this.productListLengthSubject.next(this.productSubject.value.length);
        })
      )
      .subscribe((products: Product[]) => {
        console.log("product-list-datasource.ts: loadProducts() subscription, products:", products);
        this.productSubject.next(products);
        this.productListLengthSubject.next(products.length);
      });
  }

  editProduct(product : Product) {
    console.log("editProduct in product-list-datasource.ts, passing value", product, "to productService.editProduct()");
    this.productService.editProduct(product);
  }

  deleteProduct(products : number[]) : void {
    this.productService
      .deleteProduct(products)
      .subscribe(() => {
        this.loadProducts();
      });
  }
}
