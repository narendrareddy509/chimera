import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import {
  funds,
  ProductTemplate,
} from '../../../products/model/productTemplate.model';
import { Observable, Subscription } from 'rxjs';

import {
  ConfiguredFunds,
  InvestmentConfiguration,
} from '../../model/investmentConfiguration.model';

@Component({
  selector: 'ignatica-plan-investmt-options',
  templateUrl: './plan-investmt-options.component.html',
  styleUrls: ['./plan-investmt-options.component.scss'],
})
export class PlanInvestmtOptionsComponent implements OnInit {
  @Input() investmentConfiguration: InvestmentConfiguration;
  @Input() product: ProductTemplate;
  @Input() disableControl: boolean = false;
  @Input() eventsSubject: Observable<void>;
  headers: Array<object> = [
    { name: '#', width: 60 },
    { name: 'Activate', width: 100 },
    { name: 'Fund Name' },
    { name: 'Risk Category' },
    { name: 'Fund Code', width: 100 },
  ];
  fundList = [];
  eventsSubscription: Subscription;

  constructor() {}

  ngOnInit(): void {
    if (
      this.investmentConfiguration &&
      !this.investmentConfiguration.configuredFunds
    ) {
      this.investmentConfiguration['configuredFunds'] = [];
    }
    if (this.product.funds) {
      this.fundList = this.product.funds.map((x: funds) => {
        return {
          FundId: x['fundId'],
          FundOID: x['fundOID'],
          FundName: x['description'],
          FundRiskCategory: x['fundRiskCategory'],
          IsSelected: this.investmentConfiguration['configuredFunds']
            .filter((x) => x.isEnabled)
            .map((x: ConfiguredFunds) => x.fundOID)
            .includes(x['fundOID']),
        };
      });
    }

    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      // Adding investment options to plan payload
      if (this.fundList) {
        const selectedFunds = this.fundList
          .filter((c) => c.IsSelected)
          .map((x) => {
            return {
              fundOID: x.FundOID,
              isEnabled: true, // Sending true by default, as we dont have false scenario
            };
          });
        this.investmentConfiguration.configuredFunds = [];
        this.investmentConfiguration.configuredFunds.push(...selectedFunds);
      }
    });
  }
}
