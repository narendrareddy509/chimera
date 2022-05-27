/**
 * COI Premium Rate Widget ehich defines summary of the rates.
 *
 * <p>
 * Former known as Premium Rate Summary
 * <p>
 *
 * @author [RekhaG]
 *
 */

import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ignatica-plan-coi-rate-summary',
  templateUrl: './plan-coi-rate-summary.component.html',
  styleUrls: ['./plan-coi-rate-summary.component.scss'],
})
export class PlanCoiRateSummaryComponent implements OnInit {
  @Input() heading: string = 'premium';
  @Input() coiRateTableKeys = [];
  @Input() coiRateTableRows = [];
  summaryData: any = {};
  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    if (this.coiRateTableRows) {
      this.prepareSummary();
    }
  }

  prepareSummary() {
    try {
      this.summaryData = {};
      this.coiRateTableKeys
        .filter(
          (x) =>
            x !== 'isActive' &&
            x !== 'isDeleted' &&
            x !== 'rowGuid' &&
            x !== 'id' &&
            x !== 'sourceFileName' &&
            x.toLocaleLowerCase() !== 'effectivestartdate' &&
            x.toLocaleLowerCase() !== 'effectiveenddate' &&
            x.toLocaleLowerCase() !== 'effective start date' &&
            x.toLocaleLowerCase() !== 'effective end date'
        )
        .forEach((key) => {
          let summData = this.coiRateTableRows
            .filter((item) => !item.isDeleted && item.isActive)
            .map((item) => item[key]);
          this.summaryData[key] = [...new Set(summData)];
        });
      return this.summaryData;
    } catch (e) {
      console.log('[CsvParserService.prepareSummary] Error: ', e);
      throw e;
    }
  }
}
