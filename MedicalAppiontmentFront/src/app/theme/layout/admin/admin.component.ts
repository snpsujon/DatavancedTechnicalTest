// Angular Import
import { Component, HostListener, OnInit } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  // public props
  navCollapsed!: boolean;
  navCollapsedMob: boolean;
  windowWidth: number;
  currentRoute: string = '';
  // constructor
  constructor(
    private location: Location,
    private locationStrategy: LocationStrategy,
    private commonService:GridHandlerService,
    public router: Router
  ) {
    this.windowWidth = window.innerWidth;
    this.navCollapsedMob = false;
  }
  ngOnInit(): void {
    this.currentRoute = this.router.url;
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        
        this.currentRoute = event.url;
        if(this.currentRoute == '/orderPList' || this.currentRoute == '/deliveryOrderPList'){
          this.commonService.selectedTab = 'PList'
        }
      }
    });
   
  }

  @HostListener('window:resize', ['$event'])
  // eslint-disable-next-line
  onResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
    if (this.windowWidth < 992) {
      document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
      if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('navbar-collapsed')) {
        document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('navbar-collapsed');
      }
    }
  }

  // public method
  navMobClick() {
    if (this.windowWidth < 992) {
      if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
        this.navCollapsedMob = !this.navCollapsedMob;
        setTimeout(() => {
          this.navCollapsedMob = !this.navCollapsedMob;
        }, 100);
      } else {
        this.navCollapsedMob = !this.navCollapsedMob;
      }
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('mob-open');
    }
  }
  isReportPage(){
    // 
    if(this.currentRoute == '/ReportViewer'){
      return 'margin-left: 0px !important';
    }
    return false;
  }
}
