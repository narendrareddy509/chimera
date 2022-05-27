import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '@app/master-management/service/admin.service';

@Component({
  selector: 'ignatica-upload-questionnaire',
  templateUrl: './upload-questionnaire.component.html',
  styleUrls: ['./upload-questionnaire.component.scss'],
})
export class UploadQuestionnaireComponent implements OnInit {
  @ViewChild('labelImport')
  labelImport: ElementRef;
  formImport: FormGroup;
  fileToUpload: File = null;
  showInvalid = false;
  fileName: string;

  constructor(private adminService: AdminService) {
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

  downloadCsv() {
    this.adminService.downloadUnderwritingTemplate('UnderWriting.csv');
  }
}
