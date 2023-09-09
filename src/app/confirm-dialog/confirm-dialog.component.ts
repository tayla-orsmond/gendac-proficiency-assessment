import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * A dialog component that displays a confirmation dialog with a title and a message.
 * Used by the product list component to confirm deletion of a product, but is generic enough to be used anywhere.
 * Once the dialog is closed, the result is returned to the component that opened it.
 * The dialog is closed and returns false when the cancel button is clicked.
 * The dialog is closed and returns true when the confirm button is clicked.
 *
 * @constructor {MatDialogRef<ConfirmDialogComponent>} dialogRef - The dialog reference, used to close the dialog
 * @constructor { title: string; message: string } data - The data passed to the dialog, which contains the title and message to display
 *
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  result: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string },
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  ngOnInit(): void {
    this.dialogRef.disableClose = true; // prevent closing dialog when clicking outside of it
  }

  /**
   * Closes the dialog and returns false.
   * Also subscribes to the afterClosed event to get the result.
   * @returns {boolean} false
   */
  cancel() {
    this.dialogRef.close(false);
    this.dialogRef.afterClosed().subscribe((result) => {
      this.result = result;
    });
  }

  /**
   * Closes the dialog and returns true.
   * Also subscribes to the afterClosed event to get the result.
   * @returns {boolean} true
   **/
  confirm() {
    this.dialogRef.close(true);
    this.dialogRef.afterClosed().subscribe((result) => {
      this.result = result;
    });
  }
}
