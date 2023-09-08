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

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductListComponent {
  //make sure products are displayed as a list, and handle sort and filter accordingly (also select all) and have a filter bar
  products: Product[] = [] as Product[];
  dataSource!: ProductListDataSource;
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'price',
    'category',
    'edit',
  ];

  selection = new SelectionModel<Product>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.dataSource = new ProductListDataSource(this.productService);
    this.dataSource.product$.subscribe((products: Product[]) => (this.products = products));
    // this.dataSource.loadProducts();
    //this.dataSource.loadLessons(this.course.id, '', 'asc', 0, 3);
  }

  ngAfterViewInit() {
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadProductsPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // on sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page)
      .pipe()
      .subscribe(() => {
        this.loadProductsPage();
      });
  }

  loadProductsPage() {
    this.dataSource.loadProducts();
    /*  this.dataSource.loadLessons(
            this.course.id,
            this.input.nativeElement.value,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize);
    */
  }

  toggleProductSelect(product: Product) {
    this.selection.toggle(product);
  }

  toggleAllProducts() {
    if (this.allProductsSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.products);
    }
  }

  allProductsSelected() {
    return this.selection.selected.length === this.products.length;
  }

  editProduct(product: Product) {
    // use service to edit product
    this.dataSource.editProduct(product);
  }

  addProduct(): void {
    this.dataSource.editProduct({} as Product);
  }

  // selectProduct(pID: number): void {
  //   if(this.selectedProductList.includes(pID)) {
  //     this.selectedProductList.splice(this.selectedProductList.indexOf(pID), 1);
  //   } else {
  //     this.selectedProductList.push(pID);
  //   }
  // }

  // selectAllProducts(allSelected : boolean): void {
  //   if(allSelected) {
  //     this.selectedProductList = this.dataSource.getValue().map(product => product.id);
  //   } else {
  //     this.selectedProductList = [];
  //   }
  // }

  deleteProduct(): void {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete the selected products?')) {
      return;
    }

    this.productService
      .deleteProduct(this.selection.selected.map((product) => product.id))
      .subscribe(() => {
        this.selection.clear();
        this.dataSource.loadProducts();
      });
  }
}
