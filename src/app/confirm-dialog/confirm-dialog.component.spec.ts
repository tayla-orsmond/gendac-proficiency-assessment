import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: {} }, // Mock MatDialogRef
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Test Title', message: 'Test Message' } }, // Mock MAT_DIALOG_DATA
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the provided data', () => {
    expect(component.data.title).toBe('Test Title');
    expect(component.data.message).toBe('Test Message');
  });

  it('should set dialogRef.disableClose to true in ngOnInit', () => {
    component.ngOnInit();
    expect(component.dialogRef.disableClose).toBeTrue();
  });

  it('should close the dialog with true value on confirm', () => {
    spyOn(component.dialogRef, 'close');
    component.confirm();
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false value on cancel', () => {
    spyOn(component.dialogRef, 'close');
    component.cancel();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });
});
