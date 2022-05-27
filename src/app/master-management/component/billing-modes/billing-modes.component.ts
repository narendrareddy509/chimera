import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../service/admin.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '@shared/custom/component/confirm-modal/confirm-modal.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ignatica-billing-modes',
  templateUrl: './billing-modes.component.html',
  styleUrls: ['./billing-modes.component.scss'],
})
export class BillingModesComponent implements OnInit {
  billingModes: any;
  updateBillingModes: any[] = [];
  unUpdatedBillingModes: any[] = [];
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
    this.getAllBillingModes();
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

  updateBillingMode(option, billingMode, i) {
    let message;
    this.billingModes[i].isRequired = billingMode.checked;
    let isRequiredChanged =
      JSON.stringify(this.unUpdatedBillingModes[i]) ==
      JSON.stringify(this.billingModes[i]);
    let objIndex = this.updateBillingModes.findIndex(
      (x) => x.billingModeGuid == this.billingModes[i].billingModeGuid
    );
    this.showAlert = false;

    if (billingMode.checked && !isRequiredChanged) {
      const activatedMessage = this.translateService.instant('admin.activated');
      message = `${option.name}  ${activatedMessage}`;
      this.showAlert = true;
      this._success.next('opened');

      this.action = 'success';
      this.message = message;
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
    if (!billingMode.checked && !isRequiredChanged) {
      message = this.translateService.instant(
        'admin.billingModes.billingModeNotAvailable'
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
        this.billingModes[i].isRequired = !data;
      });
    }

    if (objIndex >= 0 && isRequiredChanged) {
      this.updateBillingModes.splice(objIndex, 1);
      return;
    }
    if (objIndex < 0) {
      this.updateBillingModes.push(this.billingModes[i]);
    } else {
      this.updateBillingModes[objIndex]['isRequired'] =
        this.billingModes[i].isRequired;
    }
  }
  onSubmit() {
    let message;
    if (this.billingModes.filter((x) => x.isRequired).length <= 0) {
      const message = this.translateService.instant(
        'admin.billingModes.selectOneBillingModeError'
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
    if (this.updateBillingModes.length <= 0) {
      message = this.translateService.instant('admin.billingModes.noChanges');
      this.showAlert = true;
      this._success.next('opened');

      this.message = message;
      this.action = 'warning';
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      return;
    }

    this.adminService
      .updateBillingModeStatus(this.updateBillingModes)
      .subscribe((response) => {
        if (response.success) {
          message = this.translateService.instant(
            'admin.billingModes.checkStatusUpdated'
          );
          this.action = 'success';
        } else {
          message = this.translateService.instant(
            'admin.billingModes.checkStatusError'
          );
          this.action = 'warning';
        }
        this.getAllBillingModes();
        this.showAlert = true;
        this._success.next('opened');

        this.message = message;
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      });
  }

  getAllBillingModes() {
    this.adminService.getAllBillingModes().subscribe((billingModes: any) => {
      this.billingModes = billingModes.data;
    });
  }
}
