import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/custom/service/toast.service';

@Component({
  selector: 'ignatica-lang-select',
  templateUrl: './lang-select.component.html',
  styleUrls: ['./lang-select.component.scss'],
})
export class LangSelectComponent implements OnInit {
  selectedValue: string;
  selectedCar: string;

  constructor(private translateService: TranslateService) {}

  languages = [
    { value: 'en', viewValue: 'English' },
    { value: 'nl', viewValue: 'Dutch' },
    { value: 'zh', viewValue: 'Chinese' },
  ];

  ngOnInit(): void {
    console.log('Current Language', this.translateService.currentLang);
    this.selectedValue = this.translateService.currentLang;
  }

  onChangeLang(val) {
    this.translateService.use(val);
    this.selectedValue = val;
  }
}
