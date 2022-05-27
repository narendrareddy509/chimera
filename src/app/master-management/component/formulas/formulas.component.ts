import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../service/admin.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ignatica-formulas',
  templateUrl: './formulas.component.html',
  styleUrls: ['./formulas.component.scss'],
})
export class FormulasComponent implements OnInit {
  formulaTypes: any[] = [];
  formulas: any[] = [];
  updateFormulas: any[] = [];
  unUpdatedFormulas: any[] = [];
  message: string;
  action: string;
  showAlert: boolean = false;
  private _success = new Subject<string>();

  constructor(
    private translateService: TranslateService,
    private adminService: AdminService
  ) {
    this.adminService.getAllFormulaTypes().subscribe((formulaTypes: any) => {
      this.formulaTypes = formulaTypes.data;
    });
    this.getAllFormulas();
  }

  getFormulasByCode(formulas, code: string): any[] {
    return formulas.filter((x) => x.formulaTypeCode == code);
  }

  ngOnInit(): void {
    this._success.pipe(debounceTime(3000)).subscribe(() => {
      this.showAlert = false;
    });
  }

  updateFormula(option, checked, formulaGuid) {
    let i = this.formulas.findIndex((x) => x.formulaGuid == formulaGuid);
    this.formulas[i].isRequired = checked;
    let isRequiredChanged =
      JSON.stringify(this.unUpdatedFormulas[i]) ==
      JSON.stringify(this.formulas[i]);
    let objIndex = this.updateFormulas.findIndex(
      (x) => x.formulaGuid == formulaGuid
    );
    if (checked && !isRequiredChanged) {
      const activatedMessage = this.translateService.instant('admin.activated');
      this.message = `${option.name}  ${activatedMessage}`;
      this.showAlert = true;
      this._success.next('opened');

      this.action = 'success';
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
    if (!checked && !isRequiredChanged) {
      this.message = this.translateService.instant(
        'admin.formulas.formulaNotAvailable'
      );
      this.showAlert = true;
      this._success.next('opened');

      this.action = 'warning';
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }

    if (objIndex >= 0 && isRequiredChanged) {
      this.updateFormulas.splice(objIndex, 1);
      return;
    }
    if (objIndex < 0) {
      this.updateFormulas.push(this.formulas[i]);
    } else {
      this.updateFormulas[objIndex]['isRequired'] = this.formulas[i].isRequired;
    }
  }
  onSubmit() {
    if (this.formulas.filter((x) => x.isRequired).length <= 0) {
      const message = this.translateService.instant(
        'admin.formulas.selectOneFormulaError'
      );
      this.message = message;
      this.action = 'warning';
      this.showAlert = true;
      this._success.next('opened');

      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      return;
    }
    if (this.updateFormulas.length <= 0) {
      this.message = this.translateService.instant('admin.formulas.noChanges');
      this.action = 'warning';
      this.showAlert = true;
      this._success.next('opened');

      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      return;
    }

    this.adminService
      .updateFormulas(this.updateFormulas)
      .subscribe((response) => {
        if (response.success) {
          this.message = this.translateService.instant(
            'admin.formulas.checkStatusUpdated'
          );
          this.action = 'success';
        } else {
          this.message = this.translateService.instant(
            'admin.formulas.checkStatusError'
          );
          this.action = 'warning';
        }
        this.getAllFormulas();
        this.showAlert = true;
        this._success.next('opened');

        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      });
  }

  getAllFormulas() {
    this.adminService.getAllFormulas().subscribe((formulas: any) => {
      this.formulas = formulas.data;
      this.updateFormulas = [];
      this.unUpdatedFormulas = formulas.data.map((a) => ({ ...a }));
    });
  }
}
