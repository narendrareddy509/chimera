import {
  Component,
  OnInit,
  ComponentRef,
  ViewChild,
  Inject,
  Input,
} from '@angular/core';
import { FundPrice } from '../../../model/FundPrice.model';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/custom/service/toast.service';
import { FundService } from '../../../service/fund.service';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ignatica-create-fund-price',
  templateUrl: './create-fund-price.component.html',
  styleUrls: ['./create-fund-price.component.scss'],
})
export class CreateFundPriceComponent implements OnInit {
  @Input() data: any;
  @ViewChild('fundPriceForm') fundPriceForm: NgForm;
  fundPrice: FundPrice = new FundPrice();
  loading: boolean = false;
  componentRef: ComponentRef<any>;
  saveClicked: boolean = false;
  fundData: any = [];
  fundPriceData: any = [];
  constructor(
    private toastService: ToastService,
    public dialogRef: NgbActiveModal,
    private fundService: FundService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.fundPriceData = this.data['fundPriceData'];
    this.fundData = this.data['fundData'];
  }

  onSave() {
    this.saveClicked = true;
    if (this.fundPriceForm.valid) {
      this.loading = true;
      let message = '';
      try {
        let masterFund = this.fundData.filter(
          (x) => x['FundID'] == this.fundPrice.fundId
        );
        if (masterFund.length <= 0) {
          message = `An invalid fund ID is provided: ${this.fundPrice.fundId}.`;
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
        let samePeriodFundPrices = this.fundPriceData.filter(
          (x) =>
            x['Fund ID'] == this.fundPrice.fundId &&
            x['Fund price expiry date'] == this.fundPrice.fundPriceExpiryDate &&
            x['Fund price effective date'] ==
              this.fundPrice.fundPriceEffectiveDate
        );
        if (samePeriodFundPrices.length > 0) {
          message = `There are multiple fund prices for the same same fund ID (${this.fundPrice.fundId}) over the same fund effective period..`;
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
                'Fund ID': this.fundPrice.fundId,
                'Fund price effective date':
                  this.fundPrice.fundPriceEffectiveDate,
                'Fund price expiry date': this.fundPrice.fundPriceExpiryDate,
                'Buy price': this.fundPrice.buyPrice,
                'Sell price': this.fundPrice.sellPrice,
              },
            ],
            'manual',
            'IG_ASSET_FUND_PRICE'
          )
          .subscribe(() => {
            this.loading = false;
            this.saveClicked = false;
            message = this.translateService.instant('fund.addFundPriceSuccess');
            this.toastService.show({
              title: this.translateService.instant(
                'plan.alertMessages.errorHeading'
              ),
              description: message,
              classname: 'warning',
            });
            this.dialogRef.close({ event: 'Save', data: this.fundPrice });
          });
      } catch (ex) {
        this.toastService.show({
          title: this.translateService.instant(
            'plan.alertMessages.errorHeading'
          ),
          description: 'Error in saving fund price.',
          classname: 'warning',
        });
      }
    }
  }

  close() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
