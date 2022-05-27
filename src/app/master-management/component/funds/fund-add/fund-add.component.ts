import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Inject,
  ComponentRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Fund } from '../../../model/fund.model';
import { FundService } from '../../../service/fund.service';
import { FundDeposit } from '../../../../feature/planTemplate/model/investmentOptions.model';
import * as currencyData from 'currency-codes/data';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/custom/service/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ignatica-fund-add',
  templateUrl: './fund-add.component.html',
  styleUrls: ['./fund-add.component.scss'],
})
export class FundAddComponent implements OnInit {
  @Input() data: any;
  fund: Fund = new Fund();
  @ViewChild('addFundForm') addFundForm: NgForm;
  saveClicked: boolean = false;
  loading: boolean = false;
  currencies: any;
  symbol: any;
  @Input() fundDeposit: FundDeposit;
  componentRef: ComponentRef<any>;
  fundData: any;

  constructor(
    private fundService: FundService,
    private toastService: ToastService,
    public dialogRef: NgbActiveModal,
    private translateService: TranslateService
  ) {
    this.fundData = this.data;
  }

  ngOnInit(): void {
    this.fundData = this.data;
    this.getCurrencies();
  }
  saveFund() {
    this.saveClicked = true;
    if (this.addFundForm.valid) {
      this.loading = true;
      let message = '';
      try {
        let masterFund = this.fundData.filter(
          (x) => x['FundID'] == this.fund.FundID
        );
        if (masterFund.length > 0) {
          message = this.translateService.instant('fund.duplicatFundIDError');
          this.toastService.show({
            title: this.translateService.instant(
              'plan.alertMessages.errorHeading'
            ),
            description: message,
            classname: 'warning',
          });
          this.loading = false;
          return;
        }
        this.fundService
          .saveFund(
            [
              {
                FundID: this.fund.FundID,
                FundName: this.fund.FundName,
                FundCurrency: this.fund.FundCurrency,
                'Buy Fees': this.fund.buyFee,
                'Sell Fees': this.fund.sellFee,
                ServiceURL: this.fund.ServiceURL,
              },
            ],
            'manual',
            'IG_ASSET_FUND'
          )
          .subscribe(() => {
            this.loading = false;
            this.saveClicked = false;
            message = this.translateService.instant('fund.addFundSuccess');
            this.toastService.show({
              title: this.translateService.instant(
                'plan.alertMessages.errorHeading'
              ),
              description: message,
              classname: 'warning',
            });
            this.dialogRef.close({ event: 'Save', data: this.fund });
          });
      } catch (ex) {
        this.toastService.show({
          title: this.translateService.instant(
            'plan.alertMessages.errorHeading'
          ),
          description: 'Error in saving fund.',
          classname: 'warning',
        });
      }
    }
  }

  getCurrencies() {
    this.currencies = currencyData.map((x) => {
      return { code: x.code, name: x.currency };
    });

    return this.currencies;
  }

  close() {
    this.dialogRef.close();
  }
}
