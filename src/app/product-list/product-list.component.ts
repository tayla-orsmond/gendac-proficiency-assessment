import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProductList();
  }

  products: Product[] = [];
  selectedProduct: Product = {} as Product;
  isEdit = false;
  formVisible = false;

  getProductList(): void {
    this.productService.getProducts()
      .subscribe(products => this.products = products);
  }

  // add
  addProduct(): void {
    this.selectedProduct = {} as Product;
    this.isEdit = false;
    this.formVisible = true;
  }

  postProduct(product: Product): void {
    this.productService.addProduct(product)
      .subscribe(() => {
        this.getProductList();
      });
  }

  editProduct(product : Product): void {
    this.selectedProduct = product;
    this.isEdit = true;
    this.formVisible = true;
  }

  putProduct(product: Product): void {
    this.productService.updateProduct(product)
      .subscribe(() => {
        this.getProductList();
      });
  }

  deleteProduct(product: Product): void {
    this.productService.deleteProduct(product)
      .subscribe(() => {
        this.getProductList();
      });
  }
}
