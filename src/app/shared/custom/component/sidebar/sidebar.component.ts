import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'ignatica-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class SidebarComponent implements OnInit {
  menus = [];
  currentUser;
  constructor( private router: Router,
    private authenticationService: AuthenticationService,public sidebarservice: SidebarService) {
    this.menus = sidebarservice.getMenuList();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   }

  ngOnInit() {
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  toggle(currentMenu) {
    if (currentMenu) {
      this.menus.forEach(element => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
  }

  setActive(subMenus,currentMenu){
    subMenus.forEach(element => {
      element.active= false;
    });
    currentMenu.active= true;
  }

  

 
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}

}
