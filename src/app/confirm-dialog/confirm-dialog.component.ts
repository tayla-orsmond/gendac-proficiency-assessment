import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  result: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data : {title : string, message: string}, public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = true; // prevent closing dialog when clicking outside of it
  }
  
  confirm() {
    this.dialogRef.close(true);
    this.dialogRef.afterClosed().subscribe(result => {
      this.result = result;
    });
  }
}
