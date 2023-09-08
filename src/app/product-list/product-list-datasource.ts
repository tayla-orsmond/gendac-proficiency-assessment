import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, of as observableOf, BehaviorSubject } from 'rxjs';
import { Product } from '../product';
import { ProductService } from '../product.service';

export class ProductListDataSource extends DataSource<Product> {
  private productSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private productListLengthSubject = new BehaviorSubject<number>(0);

  public product$ = this.productSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public length$ = this.productListLengthSubject.asObservable();

  constructor(private productService: ProductService) {
    super();
    this.productService.productEditEvent$.subscribe(products => {
      this.loadProducts();
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
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((products: Product[]) => {
        this.productSubject.next(products);
        this.productListLengthSubject.next(products.length);
      });
  }

  editProduct(product : Product) {
    this.productService.editProduct(product);
  }
}
