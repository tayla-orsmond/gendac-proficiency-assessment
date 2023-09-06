import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductService],
})
export class ProductListComponent {
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProductList();
  }

  products: Product[] = [];
  selectedProducts: Product[] = [];
  activeEditProduct: Product = {} as Product;
  isEdit = false;
  formVisible = false;

  getProductList(): void {
    this.productService.getProducts()
      .subscribe(products => this.products = products);
  }

  // add
  addProduct(): void {
    this.activeEditProduct = {} as Product;
    this.isEdit = false;
    this.formVisible = true;
  }

  postProduct(product: Product): void {
    this.productService.addProduct(product)
      .subscribe(() => {
        this.getProductList();
        this.formVisible = false;
      });
  }

  editProduct(product : Product): void {
    this.activeEditProduct = product;
    this.isEdit = true;
    this.formVisible = true;
  }

  putProduct(product: Product): void {
    this.productService.updateProduct(product)
      .subscribe(() => {
        this.getProductList();
        this.formVisible = false;
      });
  }

  cancelEdit(): void {
    this.activeEditProduct = {} as Product;
    this.isEdit = false;
    this.formVisible = false;
  }

  deleteProduct(products: Product[]): void {
    this.productService.deleteProduct(products)
      .subscribe(() => {
        this.getProductList();
      });
  }
}
