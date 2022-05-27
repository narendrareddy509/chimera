import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: any[] = [];

  show(options: any = {}) {
    this.toasts = [];
    this.toasts.push(options);
  }

  remove() {
    this.toasts = [];
  }
}
