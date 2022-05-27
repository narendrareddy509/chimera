import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../master-management/service/admin.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/custom/component/confirm-modal/confirm-modal.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ignatica-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  events: any;
  updateEvents: any[] = [];
  unUpdatedEvents: any[] = [];
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
    this.getAllEvents();
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

  updateEvent(option, event, i) {
    let message;
    this.events[i].isRequired = event.target.checked;
    let isRequiredChanged =
      JSON.stringify(this.unUpdatedEvents[i]) == JSON.stringify(this.events[i]);
    let objIndex = this.updateEvents.findIndex(
      (x) => x.eventGuid == this.events[i].eventGuid
    );
    this.showAlert = false;

    if (event.target.checked && !isRequiredChanged) {
      const activatedMessage = this.translateService.instant('admin.activated');
      this.showAlert = true;
      this._success.next('opened');
      message = `${option.name}  ${activatedMessage}`;
      this.message = message;
      this.action = 'success';
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
    if (!event.target.checked && !isRequiredChanged) {
      message = this.translateService.instant('admin.events.eventNotAvailable');
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
        this.events[i].isRequired = !data;
      });
    }
    if (objIndex >= 0 && isRequiredChanged) {
      this.updateEvents.splice(objIndex, 1);
      return;
    }
    if (objIndex < 0) {
      this.updateEvents.push(this.events[i]);
    } else {
      this.updateEvents[objIndex]['isRequired'] = this.events[i].isRequired;
    }
  }
  onSubmit() {
    let message;
    if (this.events.filter((x) => x.isRequired).length <= 0) {
      message = this.translateService.instant(
        'admin.events.selectOneEventError'
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

    if (this.updateEvents.length <= 0) {
      message = this.translateService.instant('admin.events.noChanges');
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

    if (this.updateEvents.length >= 0) {
      this.adminService
        .updateEventStatus(this.updateEvents)
        .subscribe((response) => {
          if (response.success) {
            this.getAllEvents();
            message = this.translateService.instant(
              'admin.events.checkStatusUpdated'
            );
            this.message = message;
            this.action = 'success';
            this.showAlert = true;
            this._success.next('opened');

            window.scroll({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
          } else {
            this.getAllEvents();
            message = this.translateService.instant(
              'admin.events.checkStatusError'
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
          }
        });
    }
  }

  getAllEvents() {
    this.adminService.getAllEvents().subscribe((events: any) => {
      this.events = events.data;
      this.updateEvents = [];
      this.unUpdatedEvents = events.data.map((a) => ({ ...a }));
    });
  }
}
