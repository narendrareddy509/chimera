import { Injectable, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { ModalComponent } from './modal.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalService: NgbModal) { }

  public open<T>(component: ComponentType<T> | TemplateRef<T>, data: any, options: NgbModalOptions) {

    const modalRef = this.modalService.open(ModalComponent, {
      size: options.size || 'lg',
      scrollable: options.scrollable ||true
    });
    modalRef.componentInstance.component = component;
    modalRef.componentInstance.data = data;

    return modalRef;
  }
}
