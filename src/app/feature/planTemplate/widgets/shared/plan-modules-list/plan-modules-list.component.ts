/**
 * PlanModulesListComponent is generic one to display modules for combined widgets
 *
 * @author Ignatica - [Narendrareddy Chitta]
 *
 */

import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Module } from '../../../model/generalConfiguration.model';

@Component({
  selector: 'ignatica-plan-modules-list',
  templateUrl: './plan-modules-list.component.html',
  styleUrls: ['./plan-modules-list.component.scss'],
})
export class PlanModulesListComponent implements OnInit {
  heading: string;
  @Input() disableControl: boolean = false;
  @Input() public moduleList: Module[] = [];

  constructor(
    private modalRef: NgbActiveModal,
    protected _sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    if (this.moduleList.length) {
      this.heading = `${this.moduleList
        .map((x) => x.name)
        .join(' / ')} Formulas`;
      this.moduleList = this.moduleList.map((m) => {
        m.selectedFormula = m.formulas.find((c) => c.selected);
        return m;
      });
    }
  }
  saveFormulas() {
    this.modalRef.close(this.moduleList);
  }

  setSelectedFormula(module: Module, formula?) {
    if (formula) {
      module.formulas = module.formulas.map((m) => {
        m.selected = m.moduleOID === formula.moduleOID;
        return m;
      });
      module.selectedFormula = formula;
    } else {
      module.formulas = module.formulas.map((m) => {
        m.selected = false;
        return m;
      });
      module.selectedFormula = null;
    }
  }

  safeHtml(html) {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
}
