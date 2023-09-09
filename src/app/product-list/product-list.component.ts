import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { ProductListDataSource } from './product-list-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  merge,
  tap,
} from 'rxjs';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

/**
 * A component that displays a list of products.
 * The product list component is used to display the list of products, and handles most of the functionality.
 * The list is displayed as a table, and has a filter bar, sort, pagination, and select all functionality.
 * Subscribes to the product change event emitted by ProductService, and reloads the list when a product is added or edited.
 * Has a custom data source that handles the calls to the product service to load the data.
 * The [length] input of the paginator is hardcoded to 10001 for simplicity, which may cause issues in the future
 * @constructor {ProductService} productService - The product service, used to get the list of products
 * @constructor {MatDialog} dialog - The dialog service, used to open the product details dialog
 *
 * @property {ProductListDataSource} dataSource - The data source for the table
 * @property {string[]} displayedColumns - The columns to display in the table
 * @property {string[]} categories - The categories to filter by
 * @property {string} selectedCategory - The currently selected category to filter by
 * @property {SelectionModel<Product>} selection - The selection model for the table
 * @property {MatPaginator} paginator - The paginator for the table
 * @property {MatSort} sort - The sort for the table
 * @property {ElementRef} filter - The filter bar for the table
 * @property {MatTable} table - The table
 * @property {Subscription} subscription - The subscription to the product change event (used to unsubscribe on destroy)
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductListComponent {
  subscription: any;
  dataSource!: ProductListDataSource;
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'price',
    'category',
    'edit',
  ]; // Table columns
  categories: string[] = ['Id', 'Name', 'Price', 'Category', 'none']; // Filter by category options
  selectedCategory: string = 'None';

  selection = new SelectionModel<Product>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<Product>;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  // Lifecycle Hooks
  ngOnInit(): void {
    this.dataSource = new ProductListDataSource(this.productService);
    this.dataSource.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    // Subscribe to product change event (emitted by product service) after view is initialized to make use of the paginator and sort
    this.subscription = this.productService.productChangeEvent$.subscribe(
      (product) => {
        this.loadProductsPage(
          // reload the exact same page
          '',
          this.sort.direction === 'asc',
          this.paginator.pageIndex + 1,
          this.paginator.pageSize,
          this.sort.active,
          'none'
        );
        this.table.dataSource = this.dataSource;
      }
    );

    // Subscribe to filter event
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadProductsPage(
            this.filter.nativeElement.value,
            true,
            0,
            10,
            this.sort.active,
            this.selectedCategory
          );
        })
      )
      .subscribe();

    // Reset the paginator after sorting
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // On sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page)
      .pipe()
      .subscribe(() => {
        this.loadProductsPage(
          this.filter.nativeElement.value,
          this.sort.direction === 'asc',
          this.paginator.pageIndex + 1,
          this.paginator.pageSize,
          this.sort.active,
          this.selectedCategory
        );
      });
  }

  // Helpers and event handlers

  // Loading Products
  /**
   * Loads a page of products from the data source.
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
  loadProductsPage(
    filter: string = '',
    ascending: boolean = true,
    page: number = 0,
    pageSize: number = 10,
    orderBy: string = 'id',
    filterBy: string = 'none'
  ): void {
    this.dataSource.loadProducts(
      filter,
      ascending,
      page,
      pageSize,
      orderBy,
      filterBy
    );
  }

  // Selecting Products

  /**
   * Toggles selection for a product.
   * Uses the selection model to toggle selection for a product.
   *
   * @param product - The product to toggle selection for
   * @returns {void}
   */
  toggleProductSelect(product: Product): void {
    this.selection.toggle(product);
  }

  /**
   * Toggles selection for all products.
   * Uses the selection model to toggle selection for all products.
   * If all products are already selected, clears the selection.
   * If not all products are selected, selects all products.
   * Makes use of dataSource.getSubjectValue() to get the current list of products, which returns it's behavior subject's value (async).
   * @returns {void}
   */
  toggleAllProducts(): void {
    if (this.allProductsSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.getSubjectValue());
    }
  }

  /**
   * Checks if all products are selected.
   *
   * Makes use of dataSource.getSubjectValue() to get the current list of products, which returns it's behavior subject's value (async).
   * Compares the length of the selection model to the length of the list of products.
   * @returns {boolean} Whether all products are selected
   */
  allProductsSelected() {
    return (
      this.selection.selected.length ===
      this.dataSource.getSubjectValue().length
    );
  }

  // Editing Products

  /**
   * Opens the product details dialog.
   * @param product - The product to edit
   * @returns {void}
   */
  editProduct(product: Product): void {
    this.openDialog(product);
  }

  // Adding Products

  /**
   * Opens the product details dialog.
   * @param product - The product to add
   * @returns {void}
   */
  addProduct(): void {
    this.openDialog({} as Product);
  }

  // Helper
  /**
   * Opens the product details dialog.
   *
   * @param product - The product to pass to the dialog as data
   */
  openDialog(product: Product) {
    this.dialog.open(ProductDetailsComponent, {
      data: product,
      width: '50%',
      enterAnimationDuration: 300,
      exitAnimationDuration: 200,
    });
  }

  // Deleting Products

  /**
   * Deletes the selected products.
   *
   * Opens a confirmation dialog to confirm deletion.
   * If confirmed, calls the product service to delete the selected products.
   * After deletion, reloads the list of products.
   * Sets a timeout of 1 second to avoid overloading the server (due to mass deletion)
   * @returns {void}
   */
  deleteProduct(): void {
    // Open confirmation dialog
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Delete product(s)',
          message:
            'Are you sure you want to delete the selected product(s)? This cannot be undone.',
        },
        width: '20%',
        enterAnimationDuration: 300,
        exitAnimationDuration: 200,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dataSource
            .deleteProduct(this.selection.selected.map((product) => product.Id))
            .subscribe(() => {
              setTimeout(() => {
                // reload the exact same page
                this.loadProductsPage(
                  this.filter.nativeElement.value,
                  this.sort.direction === 'asc',
                  this.paginator.pageIndex + 1,
                  this.paginator.pageSize,
                  this.sort.active,
                  this.selectedCategory
                );
              }, 1000);
            });
          this.selection.clear();
        }
      });
  }

  // Filtering Products

  /**
   * Wipes the filter bar value when a new category is selected.
   * @returns {void}
   */
  wipeFilter(): void {
    this.filter.nativeElement.value = '';
  }
}
