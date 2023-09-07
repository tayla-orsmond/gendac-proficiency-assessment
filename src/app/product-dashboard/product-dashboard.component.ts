import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss'],
  providers: [ProductService],
})
export class ProductDashboardComponent { // a dashboard component that displays the product list, product details, and product add/edit form
  products: Product[] = [];
  selectedProducts: number[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProductList();
  }

  getProductList(): void {
    this.productService.getProducts()
      .subscribe(products => this.products = products);
  }

  addProduct(): void {
    this.productService.editProduct({} as Product);
  }

  selectProduct(pID: number): void {
    if(this.selectedProducts.includes(pID)) {
      this.selectedProducts.splice(this.selectedProducts.indexOf(pID), 1);
    } else {
      this.selectedProducts.push(pID);
    }
  }

  deleteProduct(products: number[]): void {
    this.productService.deleteProduct(products)
      .subscribe(() => {
        this.getProductList();
        this.selectedProducts = [];
      });
  }
}
