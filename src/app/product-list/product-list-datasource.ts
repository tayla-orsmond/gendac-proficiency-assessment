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

  public product$ = this.productSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private productService: ProductService) {
    super();
  }

  connect(_collectionViewer: CollectionViewer): Observable<Product[]> {
    return this.productSubject.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.productSubject.complete();
    this.loadingSubject.complete();
  }

  public loadProducts(
    filter: string = '',
    ascending: boolean = true,
    page: number = 0,
    pageSize: number = 10,
    orderBy: string = 'id',
    filterBy: string = 'none'
  ): void {
    this.loadingSubject.next(true);

    this.productService
      .getProducts(filter, ascending, page, pageSize, orderBy)
      .pipe(
        catchError(() => observableOf([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.productSubject.next(this.productSubject.value);
        })
      )
      .subscribe((products: Product[]) => {
        console.log(
          'product-list-datasource.ts: loadProducts() subscription, products:',
          products
        );
        // if filterBy is not none, return only the products whose attribute dictated by filterBy contains filter
        products = products.filter((product) => {
          if (filterBy === 'Id') {
            return product.Id === parseInt(filter);
          } else if (filterBy === 'Name') {
            return product.Name.toLowerCase().includes(filter.toLowerCase());
          } else if (filterBy === 'Category') {
            return product.Category === parseInt(filter);
          } else if (filterBy === 'Price') {
            return product.Price.toString().includes(filter);
          } else {
            return true;
          }
        });
        this.productSubject.next(products);
      });
  }

  editProduct(product: Product) : void{
    console.log(
      'editProduct in product-list-datasource.ts, passing value',
      product,
      'to productService.editProduct()'
    );
     this.productService.editProduct(product);
  }

  deleteProduct(products: number[]): Observable<Product[]> {
    return this.productService.deleteProduct(products);
  }

  getSubjectValue(): Product[] {
    return this.productSubject.value;
  }
}
