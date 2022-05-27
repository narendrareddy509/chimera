import { ComponentType } from '@angular/cdk/portal';
import { Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ignatica-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() data;
  @Input() component:ComponentType<any>;
  title: string;
  subTitle: string;
  productId: String;
  labels: any = {
    button: {
      first: 'Cancel',
      second: 'Save',
    },
  };

  componentRef: ComponentRef<any>;
  @ViewChild('target', { read: ViewContainerRef }) viewContainerRef;

  constructor(private modalRef:NgbActiveModal,private resolver: ComponentFactoryResolver) { 
    
  }

  ngOnInit(): void {
    this.title = this.data.title;
    this.subTitle = this.data.subTitle;

    if (this.data.labels) {
      this.labels = this.data.labels;
    }
  }

  ngAfterViewInit() {
    
    const dialogFactory = this.resolver.resolveComponentFactory(
      this.component
    );
    this.componentRef = this.viewContainerRef.createComponent(dialogFactory);
    // this.componentRef.instance.confirmed = false;
    this.componentRef.instance.data = this.data;
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  close() {
    this.componentRef.instance.confirmed = false;
    this.componentRef.instance.destroy = this.componentRef.destroy;
    this.modalRef.close(this.componentRef.instance);
  }

  confirm() {
    this.componentRef.instance.confirmed = true;
    this.componentRef.instance.destroy = this.componentRef.destroy;
    this.modalRef.close(this.componentRef.instance);
  }
}
