import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../service/admin.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '@shared/custom/component/confirm-modal/confirm-modal.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ignatica-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss'],
})
export class CurrenciesComponent implements OnInit {
  currencies: any;
  updateCurrencies: any[] = [];
  unUpdatedCurrencies: any[] = [];
  message: string;
  action: string;
  showAlert: boolean = false;
  modalOptions: NgbModalOptions;
  private _success = new Subject<string>();

  constructor(
    private translateService: TranslateService,
    private adminService: AdminService,
    private modalService: NgbModal
  ) {
    this.getAllCurrencies();
    this.modalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'ignatica-confirmation-modal',
    };
  }

  ngOnInit(): void {
    this._success.pipe(debounceTime(3000)).subscribe(() => {
      this.showAlert = false;
    });
  }

  updateCurrency(option, currency, i) {
    let message;
    this.currencies[i].isRequired = currency.checked;
    let isRequiredChanged =
      JSON.stringify(this.unUpdatedCurrencies[i]) ==
      JSON.stringify(this.currencies[i]);
    let objIndex = this.updateCurrencies.findIndex(
      (x) => x.currencyGuid == this.currencies[i].currencyGuid
    );
    this.showAlert = false;

    if (currency.checked && !isRequiredChanged) {
      const activatedMessage = this.translateService.instant('admin.activated');
      message = `${option.name}  ${activatedMessage}`;
      this.message = message;
      this.action = 'success';
      this.showAlert = true;
      this._success.next('opened');

      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
    if (!currency.checked && !isRequiredChanged) {
      message = this.translateService.instant(
        'admin.currencies.currencyNotAvailable'
      );
      const modalRef = this.modalService.open(
        ConfirmModalComponent,
        this.modalOptions
      );
      modalRef.componentInstance.data = {
        title: 'Are you sure?',
        message: message,
        confirmBtnText: this.translateService.instant('plan.alertMessages.yes'),
        cancelBtnText: this.translateService.instant('plan.alertMessages.no'),
      };
      modalRef.closed.subscribe((data) => {
        this.currencies[i].isRequired = !data;
      });
    }
    if (objIndex >= 0 && isRequiredChanged) {
      this.updateCurrencies.splice(objIndex, 1);
      return;
    }
    if (objIndex < 0) {
      this.updateCurrencies.push(this.currencies[i]);
    } else {
      this.updateCurrencies[objIndex]['isRequired'] =
        this.currencies[i].isRequired;
    }
  }
  onSubmit() {
    let message;
    if (this.currencies.filter((x) => x.isRequired).length <= 0) {
      const message = this.translateService.instant(
        'admin.currencies.selectOneCurrencyError'
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
    if (this.updateCurrencies.length <= 0) {
      message = this.translateService.instant('admin.currencies.noChanges');
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

    this.adminService
      .updateCurrenciesStatus(this.updateCurrencies)
      .subscribe((response) => {
        if (response.success) {
          message = this.translateService.instant(
            'admin.currencies.checkStatusUpdated'
          );
          this.showAlert = true;
          this.message = message;
          this.action = 'success';
          this._success.next('opened');
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
        } else {
          message = this.translateService.instant(
            'admin.currencies.checkStatusError'
          );
          this.showAlert = true;
          this.message = message;
          this.action = 'warning';
          this._success.next('opened');
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
        }
        this.getAllCurrencies();
      });
  }
  getAllCurrencies() {
    this.adminService.getAllCurrencies().subscribe((currencies: any) => {
      this.currencies = currencies.data;
    });
  }
}
