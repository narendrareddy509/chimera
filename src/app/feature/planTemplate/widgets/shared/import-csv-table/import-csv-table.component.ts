import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ignatica-import-csv-table',
  templateUrl: './import-csv-table.component.html',
  styleUrls: ['./import-csv-table.component.scss']
})
export class ImportCsvTableComponent implements OnInit {
  @ViewChild('labelImport')
  labelImport: ElementRef;
  formImport: FormGroup;
  fileToUpload: File = null;
  showInvalid = false;
  fileName: string;

  constructor() {
    this.formImport = new FormGroup({
      importFile: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  onFileChange(files: FileList) {
    this.labelImport.nativeElement.innerText = '';
    if (!files.item(0).name.endsWith('.csv')) {
      this.showInvalid = true;
      return;
    }
    this.showInvalid = false;
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map((f) => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
  }

}
