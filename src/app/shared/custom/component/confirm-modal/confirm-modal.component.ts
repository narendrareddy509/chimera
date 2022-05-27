import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ignatica-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @Input() public data;

  constructor(private modalRef:NgbActiveModal) { }

  ngOnInit(): void {
  }
  close(): void {
    this.modalRef.close(false);
  }
  confirm(): void {
    this.modalRef.close(true);
  }
}
