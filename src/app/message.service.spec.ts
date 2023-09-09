import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from './product.service';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;
  let snackBar: MatSnackBar;
  let productService: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    productService = jasmine.createSpyObj('ProductService', [
      'productChangeEvent$',
    ]);

    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        MessageService,
        {
          provide: MatSnackBar,
          useValue: jasmine.createSpyObj('MatSnackBar', ['open']),
        },
        { provide: ProductService, useValue: productService },
      ],
    });

    service = TestBed.inject(MessageService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should subscribe to productService.productChangeEvent$', () => {
    // Simulate a product change event by calling the subscriber function
    productService.productChangeEvent$.subscribe((res: string) => {
      spyOn(service, 'openSnackBar');

      // Simulate a product addition event
      if (res === 'add') {
        expect(service.openSnackBar).toHaveBeenCalledWith(
          'Product added Successfully!',
          '',
          2000,
          '.success-snackbar'
        );
      }

      // Simulate a product update event
      if (res === 'update') {
        expect(service.openSnackBar).toHaveBeenCalledWith(
          'Product updated Successfully!',
          '',
          2000,
          '.success-snackbar'
        );
      }

      // Simulate a product load event
      if (res === '') {
        expect(service.openSnackBar).toHaveBeenCalledWith(
          'Products loaded Successfully!',
          '',
          2000,
          '.success-snackbar'
        );
      }

      // Simulate an error event
      if (res.includes('error')) {
        expect(service.openSnackBar).toHaveBeenCalledWith(
          'error: Something went wrong',
          '',
          2000,
          '.error-snackbar'
        );
      }
    });
  });

  it('should add and clear messages', () => {
    // Add a message
    service.add('Test message');
    expect(service.message).toBe('Test message');

    // Clear the message
    service.clear();
    expect(service.message).toBe('');
  });

  it('should open a snackbar', () => {
    service.openSnackBar('Test message', 'Action', 3000, '.custom-panel');
    expect(snackBar.open).toHaveBeenCalledWith('Test message', 'Action', {
      duration: 3000,
      panelClass: '.custom-panel',
    });
  });
});
