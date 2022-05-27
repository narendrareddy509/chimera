import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'ignatica-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  host: {
    class: 'toast-container position-fixed',
    style: 'z-index: 1200',
  },
})
export class ToastContainerComponent implements OnInit {
  constructor(public toastService: ToastService) {}

  ngOnInit(): void {}
}
