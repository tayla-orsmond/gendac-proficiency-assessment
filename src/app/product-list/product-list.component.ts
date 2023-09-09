import {
  ChangeDetectorRef,
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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductListComponent {
  //make sure products are displayed as a list, and handle sort and filter accordingly (also select all) and have a filter bar
  dataSource!: ProductListDataSource;
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'price',
    'category',
    'edit',
  ];
  categories: string[] = ['Id', 'Name', 'Price', 'Category', 'none']; // Filter by category
  selectedCategory: string = 'None';

  selection = new SelectionModel<Product>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<Product>;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataSource = new ProductListDataSource(this.productService);
    this.dataSource.loadProducts();
  }

  ngAfterViewInit() {
    this.productService.productChangeEvent$.subscribe((product) => {
      // reload the exact same page
      this.loadProductsPage(
        '',
        this.sort.direction === 'asc',
        this.paginator.pageIndex + 1,
        this.paginator.pageSize,
        this.sort.active,
        'none'
      );
      this.table.dataSource = this.dataSource;
      this.cd.detectChanges();
      console.log('[List]: productChangeEvent subscription, product:', product);
    });

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

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // on sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page)
      .pipe()
      .subscribe(() => {
        console.log(
          '[List]: sort or page event, page no:' +
            this.paginator.pageIndex +
            ' page size:' +
            this.paginator.pageSize +
            ' sort active:' +
            this.sort.active +
            ' sort direction:' +
            this.sort.direction +
            ' filter:' +
            this.filter.nativeElement.value +
            ' category:' +
            this.selectedCategory
        );
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

  loadProductsPage(
    filter: string = '',
    ascending: boolean = true,
    page: number = 0,
    pageSize: number = 10,
    orderBy: string = 'id',
    filterBy: string = 'none'
  ) {
    console.log('[List]: loading products page because of sort or page event');
    this.dataSource.loadProducts(
      filter,
      ascending,
      page,
      pageSize,
      orderBy,
      filterBy
    );
  }

  toggleProductSelect(product: Product) {
    this.selection.toggle(product);
  }

  toggleAllProducts() {
    if (this.allProductsSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.getSubjectValue());
    }
  }

  allProductsSelected() {
    return (
      this.selection.selected.length ===
      this.dataSource.getSubjectValue().length
    );
  }

  editProduct(product: Product) {
    console.log('[List]: editing product', product);
    this.openDialog(product);
  }

  addProduct(): void {
    console.log('[List]: adding product');
    this.openDialog({} as Product);
  }

  openDialog(product: Product) {
    this.dialog.open(ProductDetailsComponent, {
      data: product,
      width: '50%',
      enterAnimationDuration: 300,
      exitAnimationDuration: 200,
    });
  }

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

  wipeFilter() {
    console.log('[List]: wiping filter' + this.filter.nativeElement.value);
    this.filter.nativeElement.value = '';
  }
}
