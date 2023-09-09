import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, of as observableOf, BehaviorSubject } from 'rxjs';
import { Product } from '../product';
import { ProductService } from '../product.service';

/**
 * Data source for the ProductList MatTable. This class should encapsulate all logic for fetching the displayed data.
 * Has a dependency on ProductService. It uses ProductService to fetch the data from the server.
 * It has two BehaviorSubjects: productSubject and loadingSubject.
 * productSubject is used to store the products fetched from the server.
 * loadingSubject is used to store the loading state of the data.
 * It implements the DataSource interface and its connect() and disconnect() methods.
 *  connect() method returns an Observable of Product[].
 *  disconnect() method is used to unsubscribe from the BehaviorSubjects.
 */
export class ProductListDataSource extends DataSource<Product> {
  private productSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public product$ = this.productSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private productService: ProductService) {
    super();
  }

  // DataSource interface methods
  connect(_collectionViewer: CollectionViewer): Observable<Product[]> {
    return this.productSubject.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.productSubject.complete();
    this.loadingSubject.complete();
  }

  // Custom methods
  /**
   * Loads products from the server and stores them in productSubject.
   *
   * @param filter - The filter string (defaults to empty string)
   * @param ascending - Whether to sort ascending or descending (defaults to true)
   * @param page - The page number (starts at 1)
   * @param pageSize - The page size (number of items per page)
   * @param orderBy - The column to order by (defaults to id)
   * @param filterBy - The category to filter by (defaults to none)
   *
   * @returns {void}
   */
  loadProducts(
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

  /**
   * Deletes products from the server
   * @param products - The product ids to delete (array of numbers)
   * @returns {Observable<Product[]>} - An Observable of Product[]
   */
  deleteProduct(products: number[]): Observable<Product[]> {
    return this.productService.deleteProduct(products);
  }

  /**
   * Returns the value of productSubject (for use with product-list component @see selection methods)
   * @returns {Product[]} - The value of productSubject
   * @see productSubject
   */
  getSubjectValue(): Product[] {
    return this.productSubject.value;
  }
}
