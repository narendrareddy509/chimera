import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  NgbActiveModal,
  NgbTypeahead,
  NgbDate,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@shared/custom/service/toast.service';
import * as moment from 'moment';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as hash from 'object-hash';
import { ProductTemplate } from '../../../../products/model/productTemplate.model';
import { term_life_rule_params } from '../../../../../shared/utility/rule-params';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ignatica-plan-rules-modal',
  templateUrl: './plan-rules-modal.component.html',
  styleUrls: ['./plan-rules-modal.component.scss'],
})
export class PlanRulesModalComponent implements OnInit {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  rule_params = term_life_rule_params;
  formatter = (x) => {
    return x.name ? x.name : x;
  };
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term === ''
          ? term_life_rule_params
          : term_life_rule_params
              .filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  rulesCategories: any = [
    {
      name: 'IG_RULE_SUBCATEGORY_PREVALIDATION',
      isEdit: false,
      saveClicked: false,
      actions: ['Pass', 'Reject', 'Referred'],
    },
    {
      name: 'IG_RULE_SUBCATEGORY_CALCULATION',
      isEdit: false,
      saveClicked: false,
      actions: ['Modifier'],
    },
  ];
  tableHeaders: any = [
    'Order',
    'Rule',
    'Input',
    'Description',
    'Input Type',
    'Rule ID',
    'Action',
  ];
  editTableHeaders: any = [
    'remove_param',
    'Order',
    'Operator',
    'Constant',
    'Modifier Rate',
    'Modifier Excess',
  ];
  searchRule: string;
  isRuleEditMode: boolean = false;
  globalParamTypes: any = ['Numeric', 'String', 'Date'];
  globalNumberOperators: any = [
    { key: 'LESS_THAN', symbol: '<', text: 'lessThan (<)' },
    { key: 'GREATER_THAN', symbol: '>', text: 'greaterThan (>)' },
    { key: 'EQUALS', symbol: '=', text: 'equalsTo (=)' },
  ];
  globalStringOperators: any = [
    { key: 'EQUALS', symbol: '=', text: 'equalsTo (=)' },
  ];
  @Input() public underwritingRuleData: any = [];
  @Input() public ruleCategory: any;
  @Input() public heading: string = null;
  @Input() disableControl: boolean = false;
  @Input() product: ProductTemplate;
  @Input() subCategories: any;
  ruleCategoryList = [];

  underwritingRuleDataDisplay: any = [];

  premiumModifiersRuleBased: any = [];
  moment = moment;

  paramMasterList: any = [];

  constructor(
    private modalRef: NgbActiveModal,
    public toastService: ToastService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.globalParamTypes = ['Numeric', 'String', 'Date'];
    if (Array.isArray(this.ruleCategory)) {
      this.ruleCategoryList = [...this.ruleCategoryList, ...this.ruleCategory];
    } else {
      this.ruleCategoryList.push(this.ruleCategory);
    }

    if (this.subCategories) {
      this.rulesCategories = this.subCategories;
    }
    if (this.underwritingRuleData) {
      let paramList = [];
      this.underwritingRuleData.forEach((rule: any) => {
        let ruleObj: any = {};
        const rowHash = hash(rule);
        let inputValueName = [];
        inputValueName = this.rule_params.filter(
          (x) => x.code == rule.inputValueName
        );
        ruleObj.id = rowHash;
        ruleObj.ruleName = rule.ruleName;
        ruleObj.ruleDescription = rule.ruleDescription
          ? rule.ruleDescription
          : '';
        ruleObj.ruleId = rule.ruleId;
        ruleObj.exhashedId = `${rule.ruleId}ex`;
        ruleObj.inhashedId = `${rule.ruleId}in`;
        ruleObj.ruleSubCategory = rule.ruleSubCategory;
        ruleObj.ruleCategory = rule.ruleCategory;
        ruleObj.ruleSequence = rule.ruleSequence;
        ruleObj.ruleParameters = [];
        if (ruleObj.ruleCategory == 'IG_RULE_CATEGORY_PREMIUM') {
          ruleObj.input = rule.inputValueName;
        } else {
          ruleObj.input =
            inputValueName.length > 0
              ? inputValueName[0].name
              : rule.inputValueName;
        }
        ruleObj.internalparameterName =
          inputValueName.length > 0 ? rule.inputValueName : null;
        ruleObj.externalparameterName =
          inputValueName.length > 0 ? null : rule.inputValueName;
        ruleObj.selectedRuleType =
          inputValueName.length > 0 ? `${rule.ruleId}in` : `${rule.ruleId}ex`;
        ruleObj.ruleType =
          inputValueName.length > 0 ? inputValueName[0] : rule.inputValueName;
        // Assigning default data type from constant
        ruleObj.isInternal = inputValueName.length > 0 ? true : false;
        ruleObj.isExternal = inputValueName.length > 0 ? false : true;
        if (ruleObj.ruleCategory == 'IG_RULE_CATEGORY_PREMIUM') {
          ruleObj.ruleDescription = rule.ruleDescription;
        } else {
          ruleObj.ruleExDescription = ruleObj.isExternal
            ? rule.ruleDescription
            : '';
          ruleObj.ruleInDescription = ruleObj.isInternal
            ? rule.ruleDescription
            : '';
          ruleObj.parameterType =
            inputValueName.length > 0 ? inputValueName[0].dataType : null;
        }

        ruleObj.disableControl = inputValueName.length > 0 ? true : false;
        rule.ruleParameters.forEach((param: any) => {
          let ruleParamObj: any = {};
          if (param.parameterDecimalValue || param.parameterDecimalValue == 0) {
            ruleObj.parameterType = 'Numeric';
          } else if (param.parameterDateValue) {
            ruleObj.parameterType = 'Date';
          } else if (param.parameterTextValues || ruleObj.parameterTextValue) {
            ruleObj.parameterType = 'String';
          }

          paramList.push(ruleParamObj);
          ruleParamObj.Operator = param.parameterConditonOperator;
          ruleParamObj.parameterSequence = param.parameterSequence;
          if (
            param.passConditionAction &&
            param.passConditionAction.modifierExcess
          ) {
            ruleParamObj['Modifier Excess'] =
              param['passConditionAction']['modifierExcess'];
            ruleParamObj['Modifier Rate'] =
              param['passConditionAction']['modifierPercentage'] * 100;
          }
          if (ruleObj.parameterType == 'Date') {
            ruleParamObj.parameterDateValue = this.parseToNgbDate(
              moment(param.parameterDateValue).format('YYYY-MM-DD')
            );
          }
          if (ruleObj.parameterType == 'Numeric') {
            ruleParamObj.parameterDecimalValue = param.parameterDecimalValue;
          } else if (ruleObj.parameterType == 'String') {
            ruleParamObj.parameterTextValue = param.parameterTextValues
              ? param.parameterTextValues[0]
              : '';
          }

          ruleObj.ruleParameters.push(ruleParamObj);
        });
        this.underwritingRuleDataDisplay.push(ruleObj);
      });

      // Saving distinct params to master parameters list
      this.paramMasterList = cloneDeep([
        ...new Map(
          paramList.map((item) => [item['parameterName'], item])
        ).values(),
      ]);
    }
  }

  getKeys(key) {
    return key === 'Rule Name'
      ? 'ruleName'
      : key === 'Rule ID'
      ? 'ruleId'
      : key === 'Constant'
      ? 'parameterDecimalValue'
      : key === 'Parameter Type'
      ? 'parameterType'
      : undefined;
  }
  addNewRule(ruleSubCategory, ruleCategoryIndex) {
    const newRule = {
      ruleName: '',
      ruleDescription: '',
      isEdit: true,
      hashedId: this.underwritingRuleDataDisplay.length + '-ruleSubCategory',
      exhashedId: `${this.underwritingRuleDataDisplay.length}-ruleSubCategory-ex`,
      inhashedId: `${this.underwritingRuleDataDisplay.length}-ruleSubCategory-in`,
      ruleParameters: [],
      ruleSubCategory: ruleSubCategory,
      ruleCategory: ruleCategoryIndex,
      isInternal: true,
      isExternal:
        ruleCategoryIndex !== 'IG_RULE_CATEGORY_PREMIUM' ? false : true,
      selectedRuleType:
        ruleCategoryIndex !== 'IG_RULE_CATEGORY_PREMIUM'
          ? `${this.underwritingRuleDataDisplay.length}-ruleSubCategory-in`
          : `${this.underwritingRuleDataDisplay.length}-ruleSubCategory-ex`,
      externalparameterName: null,
      internalparameterName: null,
      ruleExDescription: '',
      ruleInDescription: '',
      input: '',
    };
    this.underwritingRuleDataDisplay.push(newRule);
  }
  getRulesBySubCategory(ruleSubCategory, ruleCategoryIndex) {
    return this.underwritingRuleDataDisplay.filter(
      (x) =>
        x.ruleSubCategory == ruleSubCategory &&
        x.ruleCategory == ruleCategoryIndex
    );
  }
  getRulesByCategory(ruleCategory) {
    if (this.subCategories) {
      return this.rulesCategories.filter((x) => x.category == ruleCategory);
    }
    return this.rulesCategories;
  }
  keyDownFunction(event, rate) {
    rate['disableControl'] = false;
  }
  removeRule(i, hashedId) {
    let index = this.underwritingRuleDataDisplay.findIndex(
      (x) => x.id == hashedId || x.hashedId == hashedId
    );
    this.underwritingRuleDataDisplay.splice(index, 1);
  }

  saveRules() {
    let ruleValid = true;
    this.underwritingRuleDataDisplay.forEach((rule: any, i) => {
      let ruleObj: any = {};
      rule.conditionValid = true;
      if (rule.ruleName == '') {
        ruleValid = false;
        this.premiumModifiersRuleBased = [];
        this.toastService.show({
          title: this.translateService.instant(
            'plan.alertMessages.errorHeading'
          ),
          description: 'Rule names cannot be empty.',
          classname: 'warning',
        });
        return;
      }
      if (
        rule.internalparameterName == '' &&
        rule.externalparameterName == ''
      ) {
        ruleValid = false;
        this.premiumModifiersRuleBased = [];
        this.toastService.show({
          title: this.translateService.instant(
            'plan.alertMessages.errorHeading'
          ),
          description: 'Input cannot be empty.',
          classname: 'warning',
        });
        return;
      }
      ruleObj.ruleName = rule.ruleName;
      ruleObj.ruleSequence = i + 1;
      ruleObj.ruleCategory = rule.ruleCategory;
      ruleObj.ruleSubCategory = rule.ruleSubCategory;
      if (ruleObj.ruleCategory == 'IG_RULE_CATEGORY_PREMIUM') {
        ruleObj.inputValueName = rule.input;
        //ruleObj.parameterType = rule.parameterType;
        ruleObj.ruleDescription = rule.ruleDescription;
      } else {
        ruleObj.ruleDescription =
          rule.selectedRuleType?.indexOf('in') >= 0
            ? rule.ruleInDescription
            : rule.ruleExDescription;
        ruleObj.inputValueName =
          rule.selectedRuleType?.indexOf('in') >= 0
            ? rule.internalparameterName
            : rule.externalparameterName;
        let inputValueName = [];
        inputValueName = this.rule_params.filter(
          (x) => x.code == rule.internalparameterName
        );
        //ruleObj.parameterType = rule.internalparameterName ? inputValueName[0].dataType : rule.parameterType;
      }

      ruleObj.ruleParameters = [];
      rule.ruleParameters.forEach((param: any) => {
        let ruleParamObj: any = {};
        ruleParamObj.parameterSequence = param.parameterSequence;
        if (rule.parameterType == 'Numeric') {
          if (
            !param.parameterDecimalValue &&
            param.parameterDecimalValue !== 0
          ) {
            ruleValid = false;
            rule.conditionValid = false;
            this.toastService.show({
              title: this.translateService.instant(
                'plan.alertMessages.errorHeading'
              ),
              description: `Condition constant cannot be empty for Rule ${rule.ruleName}.`,
              classname: 'warning',
            });
            return;
          }
          ruleParamObj.parameterDecimalValue = param.parameterDecimalValue;
        }
        if (rule.parameterType == 'String') {
          if (!param.parameterTextValue) {
            ruleValid = false;
            rule.conditionValid = false;
            this.toastService.show({
              title: this.translateService.instant(
                'plan.alertMessages.errorHeading'
              ),
              description: `Condition constant cannot be empty for Rule ${rule.ruleName}.`,
              classname: 'warning',
            });
            return;
          }
          ruleParamObj.parameterTextValues = [];
          ruleParamObj.parameterTextValues.push(
            param.parameterTextValue?.toUpperCase()
          );
        }
        if (rule.parameterType == 'Date') {
          if (!param.parameterDateValue) {
            ruleValid = false;
            rule.conditionValid = false;
            this.toastService.show({
              title: this.translateService.instant(
                'plan.alertMessages.errorHeading'
              ),
              description: `Condition constant cannot be empty for Rule ${rule.ruleName}.`,
              classname: 'warning',
            });
            return;
          }
          ruleParamObj.parameterDateValue = new Date(
            this.parseToDate(param.parameterDateValue)
          )
            .toISOString()
            .replace('Z', '+0000');
        }
        ruleParamObj['parameterConditonOperator'] = param['Operator'];
        ruleParamObj['isActive'] = true;
        ruleParamObj['passConditionAction'] = { functionCall: null };
        ruleParamObj['failConditionAction'] = {
          isConditionFailed: true,
          functionCall: null,
        };
        if (param['Modifier Rate']) {
          ruleParamObj['passConditionAction']['modifierPercentage'] =
            param['Modifier Rate'] / 100;
          ruleParamObj['passConditionAction']['modifierExcess'] =
            param['Modifier Excess'];
        }
        ruleObj.ruleParameters.push(ruleParamObj);
      });
      if (!rule.conditionValid) {
        this.premiumModifiersRuleBased = [];
        return;
      }
      this.premiumModifiersRuleBased.push(ruleObj);
    });
    // Sort rules in the order and add ruleSequence
    this.premiumModifiersRuleBased = this.groupByType(
      this.premiumModifiersRuleBased,
      'ruleSubCategory'
    );
    if (ruleValid) {
      this.modalRef.close(this.premiumModifiersRuleBased);
    }
  }

  parseToNgbDate(dateString: string): NgbDate {
    if (dateString) {
      const date = new Date(dateString);
      return new NgbDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
    }
    return null;
  }

  parseToDate(dateString: NgbDate): string {
    if (dateString) {
      return [
        dateString.year,
        ('0' + dateString.month).slice(-2),
        ('0' + dateString.day).slice(-2),
      ].join('-');
    }
    return null;
  }
  removeCondition(rule, index) {
    rule.ruleParameters.splice(index, 1);
  }
  addCondition(rule) {
    if (!(rule.ruleParameters && rule.ruleParameters.length > 0)) {
      rule.ruleParameters = [];
    }
    const obj = {
      parameterSequence: rule.ruleParameters
        ? rule.ruleParameters.length + 1
        : 1,
      parameterType: 'Numeric',
    };
    rule.ruleParameters.push(obj);
  }
  onSaveRuleClick(rule: any) {
    rule.saveClicked = true;
    if (rule.ruleCategory == 'IG_RULE_CATEGORY_PREMIUM') {
      rule.input = rule.input;
    }
    if (rule.ruleCategory !== 'IG_RULE_CATEGORY_PREMIUM' && rule.isInternal) {
      let inputValueName = [];
      inputValueName = this.rule_params.filter(
        (x) => x.code == rule.internalparameterName
      );
      rule.input = inputValueName[0]?.name;
      rule.ruleDescription = rule.ruleInDescription;
    }
    if (rule.ruleCategory !== 'IG_RULE_CATEGORY_PREMIUM' && rule.isExternal) {
      rule.input = rule.externalparameterName;
      rule.ruleDescription = rule.ruleExDescription;
    }

    if (rule.ruleName !== '') {
      rule.isEdit = false;
    } else {
      rule.isEdit = true;
    }
  }
  onSaveRuleCategoryClick(category: any) {
    category.saveClicked = true;
    this.underwritingRuleDataDisplay = this.underwritingRuleDataDisplay.map(
      (x) => {
        if (x.ruleSubCategory == category.name && x.ruleName == '') {
          x.saveClicked = true;
          x.isEdit = true;
        }
        return x;
      }
    );
    let emptyRulesName = this.underwritingRuleDataDisplay.filter(
      (x) => x.ruleSubCategory == category.name && x.ruleName == ''
    );
    if (emptyRulesName.length > 0) {
      category.isEdit = true;
    } else {
      category.isEdit = false;
    }
  }
  selectedParamNameItem(event, rate) {
    rate['parameterType'] = this.rule_params.filter(
      (x) => x.code == event
    )[0].dataType;
  }
  /* search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => {
        let retList = [];
        if (term.length > 2) {
          const typeArr = JSON.parse(JSON.stringify(this.paramMasterList));
          retList = typeArr
            .map((x) => x.parameterName)
            .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1);
        }
        return retList;
      })
    );
  };*/
  drop(event: CdkDragDrop<string[]>, ruleCategory: string) {
    /* Event has index data of rows displayed in UI but the actual
     index are different as we're filtering data based on rulesubcategory in html so 
     getting original indices from main rules array */
    event.currentIndex = this.underwritingRuleDataDisplay.findIndex(
      (s) =>
        s.id ==
        this.underwritingRuleDataDisplay.filter(
          (c) => c.ruleSubCategory == ruleCategory
        )[event.currentIndex].id
    );
    event.previousIndex = this.underwritingRuleDataDisplay.findIndex(
      (s) => s.id == event.item.data.id
    ); // event.item will provide data of dragged row
    moveItemInArray(
      this.underwritingRuleDataDisplay,
      event.previousIndex,
      event.currentIndex
    );
  }
  groupByType(array, key) {
    let arrObj = array.reduce((r, a) => {
      r[a[key]] = r[a[key]] || [];
      a.ruleSequence = r[a[key]].length + 1;
      r[a[key]].push(a);
      return r;
    }, {});
    let finalArr = [];
    Object.keys(arrObj).forEach(function (b) {
      finalArr = [...finalArr, ...arrObj[b]];
    });
    return finalArr;
  }
}
