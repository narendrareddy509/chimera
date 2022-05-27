import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/custom/service/toast.service';
import { TranslateCacheService } from 'ngx-translate-cache';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '@shared/custom/service/authentication.service';
import { SidebarService } from '@shared/custom/component/sidebar/sidebar.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'ignatica-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ignatica-web-ui';
  currentUser;
  showSideBar = true;
  isAdmin: boolean = false;
  isProdManager: boolean = false;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private sidebarservice: SidebarService,
    private translateCacheService: TranslateCacheService,
    private toastService: ToastService
  ) {
    translateCacheService.init();
    translateService.addLangs(['en', 'nl', 'zh']);
    const browserLang =
      translateCacheService.getCachedLanguage() ||
      translateService.getBrowserLang();
    translateService.use(browserLang.match(/en|nl|zh/) ? browserLang : 'en');
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.showSideBar = !(this.router.url == '/page-not-found');
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
    this.sidebarservice.setSidebarState(true);
  }

  ngOnInit() {
    this.toastService.remove();
  }
}
