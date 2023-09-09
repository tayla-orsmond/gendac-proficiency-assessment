import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from './product';

describe('ProductService', () => {
  let injector: TestBed;
  let productService: ProductService;
  let httpMock: HttpTestingController;
  let productsUrl = 'https://gendacproficiencytest.azurewebsites.net/API/ProductsAPI/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    injector = getTestBed();
    productService = injector.get(ProductService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  it('should fetch products from the API', () => {
    const dummyProducts: Product[] = [
      { Id: 1, Name: 'Product ABC12345', Category: 1, Price: 10.99 },
      { Id: 2, Name: 'Product DEF56789', Category: 2, Price: 20.99 },
    ];

    productService
      .getProducts()
      .subscribe((products) => expect(products).toEqual(dummyProducts));

    const req = httpMock.expectOne(`${productsUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush({ Results: dummyProducts });
  });

  it('should add a product to the API', () => {
    const dummyProduct: Product = {
      Id: 1,
      Name: 'Product ABC12345',
      Category: 1,
      Price: 10.99,
    };

    productService.addProduct(dummyProduct);

    const req = httpMock.expectOne(`${productsUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyProduct);

    productService.productChangeEvent$.subscribe((result) => {
      expect(result).toBe('add');
    });
  });

  it('should update a product on the API', () => {
    const dummyProduct: Product = {
      Id: 1,
      Name: 'Updated Product 1',
      Category: 2,
      Price: 15.99,
    };

    productService.updateProduct(dummyProduct);

    const req = httpMock.expectOne(
      `${productsUrl}${dummyProduct.Id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(dummyProduct);

    productService.productChangeEvent$.subscribe((result) => {
      expect(result).toBe('update');
    });
  });

  it('should delete products from the API', () => {
    const dummyIds: number[] = [1, 2, 3];

    productService.deleteProduct(dummyIds).subscribe((result) => {
      expect(result).toEqual([]); // Since it returns an empty observable
    });

    dummyIds.forEach((id) => {
      const req = httpMock.expectOne(`${productsUrl}${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  it('should fetch a product by id from the API', () => {
    const dummyProduct: Product = {
      Id: 1,
      Name: 'Product 1',
      Category: 1,
      Price: 10.99,
    };

    productService.getProduct(dummyProduct.Id).subscribe((product) => {
      expect(product).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne(
      `${productsUrl}${dummyProduct.Id}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyProduct);
  });
});
