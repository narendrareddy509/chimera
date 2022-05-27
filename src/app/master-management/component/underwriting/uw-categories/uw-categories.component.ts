import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AdminService } from '@app/master-management/service/admin.service';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ignatica-uw-categories',
  templateUrl: './uw-categories.component.html',
  styleUrls: ['./uw-categories.component.scss'],
})
export class UwCategoriesComponent implements OnInit {
  showCategoryAlert: boolean = false;
  categoryMessage: any = [];
  dismissible: boolean = false;
  categoryName: string;
  action: string = 'warning';
  saveCategory: boolean = false;
  categories: Array<any> = [];
  private _success = new Subject<string>();
  constructor(
    private adminService: AdminService,
    protected _sanitizer: DomSanitizer
  ) {
    this.getUnderwritingCategories();
  }
  safeHtml(html) {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit(): void {}

  addUnderwritingCategory() {
    this.saveCategory = true;
    if (!this.categoryName) {
      return;
    }

    let underwritingCategory = {
      category: this.categoryName.trim(),
      isRequired: false,
      isActive: true,
      version: 'v1.0',
      name: this.categoryName.trim(),
      code: this.categoryName.trim(),
    };
    let payload: any = {};
    payload.underwriting = [underwritingCategory];
    payload.userName = localStorage.getItem('currentUser');
    this.adminService.createUnderwritingCategories(payload).subscribe(
      (response) => {
        this.categoryName = null;
        this.saveCategory = false;
        this.getUnderwritingCategories();
        this.showCategoryAlert = true;
        this.categoryMessage = 'Underwriting category is created successfully.';
        this.action = 'success';
        this.dismissible = true;
      },
      (error) => {
        this.showCategoryAlert = true;
        this.categoryMessage = 'Failed to create underwriting category.';
        this.action = 'danger';
        this.dismissible = true;
      }
    );
  }

  getUnderwritingCategories() {
    this.adminService
      .getUnderwritingCategories()
      .subscribe((underWritingcategory: any) => {
        this.categories = underWritingcategory.data;
      });
  }
}
