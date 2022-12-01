import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    label: string;
    message: { before: string, bold: string, after: string };
    params: any;
    approveFunction: Function;
}

@Component({
    selector: 'approve-dialog',
    templateUrl: 'approve.dialog.html',
    styleUrls: [
        './approve.dialog.common.scss',
        './approve.dialog.mobile.scss'
    ]
})
export class ApproveDialog {
    showLoader: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<ApproveDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    async onRemoveClick() {
        this.showLoader = true;
        this.data.approveFunction(this.data.params).subscribe(
            res => { this.dialogRef.close(res) },
            err => { this.dialogRef.close() })
    }
}