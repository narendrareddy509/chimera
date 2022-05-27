import { Injectable, SimpleChange } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { product_category } from '../../../../shared/utility/product-category';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  selectedProductType$: BehaviorSubject<string> = new BehaviorSubject(
    'IG_CATEGORY_ALL'
  );
  toggled = false;
  _hasBackgroundImage = true;
  menus: any = [];
  constructor() {
    this.menus.push(
      {
        title: 'Products',
        icon: 'home',
        active: false,
        type: 'simple',
        routerLink: '/',
      },
      {
        title: 'Plans',
        type: 'header',
      }
    );
    let planCat = product_category
      .filter((p) => p.isActive)
      .map((product) => {
        return {
          title: product.name,
          icon: product.icon,
          active: false,
          type: 'simple',
          routerLink: `/planTemplate/plans/category/${product.code
            .split('IG_CATEGORY_')[1]
            .toLocaleLowerCase()}`,
        };
      });

    // Admin menu links
    const adminMenu = [
      {
        title: 'Admin settings',
        type: 'header',
      },
      {
        title: 'Billing Modes',
        icon: 'clock',
        active: false,
        type: 'simple',
        routerLink: '/master-management/billing-modes',
      },
      {
        title: 'Currencies',
        icon: 'dollar-sign',
        active: false,
        type: 'simple',
        routerLink: '/master-management/currencies',
      },
    ];
    // End of Admin

    // Fund menu links
    const fundMenu = [
      {
        title: 'Funds Settings',
        type: 'header',
      },
      {
        title: 'Funds',
        icon: 'crosshair',
        active: false,
        type: 'simple',
        routerLink: '/funds',
      },
      /*{
        title: 'Fund Price',
        icon: 'dollar-sign',
        active: false,
        type: 'simple',
        routerLink: '/funds/fundprice',
      },*/
    ];
    // End of fund menu

    this.menus = [...this.menus, ...planCat, ...adminMenu, ...fundMenu];
  }

  toggle() {
    this.toggled = !this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  getMenuList() {
    return this.menus;
  }

  get hasBackgroundImage() {
    return this._hasBackgroundImage;
  }

  set hasBackgroundImage(hasBackgroundImage) {
    this._hasBackgroundImage = hasBackgroundImage;
  }
}
