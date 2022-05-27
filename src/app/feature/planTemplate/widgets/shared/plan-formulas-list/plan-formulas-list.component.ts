import { Component, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ignatica-plan-formulas-list',
  templateUrl: './plan-formulas-list.component.html',
  styleUrls: ['./plan-formulas-list.component.scss'],
})
export class PlanFormulasListComponent implements OnInit {
  @Input() public formulas: any = [];
  @Input() showDeathBenefitPercent: Boolean = false;
  @Input() deathBenefitPercentage: number;
  @Input() public heading: string;
  @Input() disableControl: boolean = false;
  @Input() public subTitle: string;
  @Input() selectedFormula: any;
  constructor(
    private modalRef: NgbActiveModal,
    protected _sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {}
  saveFormulas() {
    if (this.showDeathBenefitPercent) {
      let data = {
        selectedFormula: this.selectedFormula,
        deathBenefitPercentage: this.deathBenefitPercentage,
      };
      this.modalRef.close(data);
    } else {
      this.modalRef.close(this.selectedFormula);
    }
  }
  setFormula(formula?) {
    if (formula) {
      this.formulas = this.formulas.map((m) => {
        m.selected = m.moduleOID === formula.moduleOID;
        return m;
      });
      this.selectedFormula = formula;
    } else {
      this.formulas = this.formulas.map((m) => {
        m.selected = false;
        return m;
      });
      this.selectedFormula = null;
    }
  }
  safeHtml(html) {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
}
