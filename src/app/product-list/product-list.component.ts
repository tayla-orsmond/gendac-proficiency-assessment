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

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductListComponent {
  //make sure products are displayed as a list, and handle sort and filter accordingly (also select all) and have a filter bar
  products: Product[] = [];
  dataSource!: ProductListDataSource;
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'price',
    'category',
    'edit',
  ];
  categories: string[] = ['ID', 'Name', 'Price', 'Category', 'none']; // Filter by category
  selectedCategory: string = 'None';

  selection = new SelectionModel<Product>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<Product>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.dataSource = new ProductListDataSource(this.productService);
    // this.dataSource.loadProducts();
    // this.productService.productChangeEvent$.subscribe((products) => {
    //   this.dataSource.loadProducts();
    //   console.log('product-list.component.ts: productChangeEvent$ subscription, products:', products);
    // });
  }

  ngAfterViewInit() {
    this.products = this.dataSource.getSubjectValue();
    this.table.dataSource = this.dataSource;
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadProductsPage(this.filter.nativeElement.value, true, 0, 10, this.sort.active, this.selectedCategory);
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // on sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page)
      .pipe()
      .subscribe(() => {
        this.loadProductsPage(
          '',
          this.sort.direction === 'asc',
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          'none'
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
    this.dataSource.loadProducts(filter, ascending, page, pageSize, orderBy, filterBy);
    this.products = this.dataSource.getSubjectValue();
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
    return this.selection.selected.length === this.products.length;
  }

  editProduct(product: Product) {
    console.log('[List]: editing product', product);
    // use service to edit product
    this.dataSource.editProduct(product);
  }

  addProduct(): void {
    this.dataSource.editProduct({} as Product);
  }

  deleteProduct(): void {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete the selected products?')) {
      return;
    }

    this.dataSource.deleteProduct(
      this.selection.selected.map((product) => product.Id)
    );
    this.selection.clear();
    this.loadProductsPage(
      '',
      this.sort.direction === 'asc',
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.selectedCategory
    );
  }

  wipeFilter() {
    console.log('[List]: wiping filter' + this.filter.nativeElement.value);
    this.filter.nativeElement.value = '';
  }
}
