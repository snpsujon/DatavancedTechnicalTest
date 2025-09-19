import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DxTabsComponent } from 'devextreme-angular';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-button-control',
  templateUrl: './button-control.component.html',
  styleUrls: ['./button-control.component.css']
})
export class ButtonControlComponent implements OnInit, AfterViewInit {
  @Input() isAdd: boolean = true;
  @Input() isEdit: boolean = true;
  @Input() isDelete: boolean = true;
  @Input() isDetails: boolean = true;
  @ViewChild('withText') withText!: DxTabsComponent;

  @ViewChild('withIconAndText') withIconAndText!: DxTabsComponent;

  @ViewChild('withIcon') withIcon!: DxTabsComponent;

  tabsWithText: any[] = [];

  tabsWithIconAndText: any[] = [];

  tabsWithIcon: any[] = [];

  orientations: string[] = ['horizontal', 'vertical'];

  stylingModes: string[] = ['primary', 'secondary'];

  iconPositions: string[] = ['top', 'start', 'end', 'bottom'];

  width = '100%';

  orientation: string = 'horizontal';

  stylingMode: string = 'primary';

  iconPosition: string = 'top';

  showNavButtons = false;

  scrollByContent = false;

  rtlEnabled = false;

  shouldRestrictWidth = true;

  widgetWrapperClasses = {
    'widget-wrapper': false,
    'widget-wrapper-horizontal': true,
    'widget-wrapper-vertical': false,
    'strict-width': false,
    width: '100%'
  };
  permissionData: any = {};
  currentRoute: string = '';
  constructor(
    private dataService: HttpClientConnectionService,
    private router: Router,
    public commonService: GridHandlerService,
    private activatedRoute: ActivatedRoute,
    private common: CommonService
  ) {
    this.currentRoute = this.router.url;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        // Parse the URL
        const queryString = this.currentRoute.split('?')[1]; // gets 'do=4'

        if (queryString) {
          const params = new URLSearchParams(queryString);
          if (params.has('do')) {
            if (this.commonService.selectedTab == 'Form') {
              this.commonService.selectedTab = 'Edit';
            }
          }
        }
this.ngAfterViewInit(); // Call after view init to ensure permission data is fetched
        if (this.currentRoute == '/orderPList' || this.currentRoute == '/deliveryOrderPList') {
          this.commonService.selectedTab = 'PList';
        }
      }
    });
  }
  ngAfterViewInit(): void {
    this.common.getPermissionData(this.router.url.split('?')[0]).subscribe((data: any) => {
      debugger;
      this.permissionData = data.data;
    });
  }
  ngOnInit(): void {
    if (this.currentRoute == '/orderPList' || this.currentRoute == '/deliveryOrderPList') {
      this.commonService.selectedTab = 'PList';
    }
  }

  selectTab(tab: string): void {
    if (tab == 'Save' || tab == 'Delete' || tab == 'GMR') {
      if (tab == 'Save') {
        this.commonService.addNew();
      } else if (tab == 'GMR') {
        this.commonService.generateMR();
      } else {
        if (this.commonService.checkBoxSelectedData.length > 0) {
          Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete selected record',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
          }).then((result) => {
            if (result.value) {
              this.commonService.delete();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire('Cancelled', 'Your record is safe :)', 'error');
              this.commonService.checkBoxSelectedData = [];
            }
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Please select a record to delete',
            showConfirmButton: false,
            timer: 1500 // auto close after 1.5 seconds
          });
        }
        // if (this.commonService.checkBoxSelectedData.length > 0) {
        //   if (confirm("Are you sure to delete selected record(s)?") == true) {
        //     this.commonService.delete();
        //   }

        // } else {
        //   alert("Please select record to delete");
        // }
      }
    }

    else if (tab == 'B2S') {
        if (this.commonService.checkBoxSelectedData.length > 0) {
          Swal.fire({
            title: 'Are you sure?',
            text: 'You want to Back To Sales Confirm?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, go back!',
            cancelButtonText: 'No, keep it'
          }).then((result) => {
            if (result.value) {
              this.commonService.backToSalesConfirm();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire('Cancelled', 'Your record is safe :)', 'error');
              this.commonService.checkBoxSelectedData = [];
            }
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Please select a record to go back',
            showConfirmButton: false,
            timer: 1500 // auto close after 1.5 seconds
          });
        }
      } else if (tab == 'Details') {
        Swal.fire({
          icon: 'warning',
        title: 'Please go to List then Select a Record',
        showConfirmButton: false,
        timer: 1800 // auto close after 1.8 seconds
      });
      // alert("Please go to List then Select a Record");
    } else if (tab == 'Approve') {
      this.commonService.approve();
    } else {
      const fullUrl = this.router.url.split('?')[0];
      const routeSegment = fullUrl.split('/')[1];
      var minorTab = '';
      minorTab = routeSegment.includes('PList')
        ? 'PList'
        : routeSegment.includes('Form')
          ? 'Form'
          : routeSegment.includes('List')
            ? 'List'
            : 'PList';
      // if(tab =="List"){
      //   minorTab='Form';
      // }else{
      //   minorTab='List'
      // }
      var redirectRoute = routeSegment.replace(minorTab, tab);
      this.router.navigate(['/' + redirectRoute]);
    }
    if (tab !== 'Approve') {
      this.commonService.selectedTab = tab;
    }
  }

  isShowEdit(): boolean {
    var x =
      this.currentRoute !== '/salesConfirmList' &&
      this.commonService.selectedTab != 'List' &&
      this.commonService.selectedTab != 'Form' &&
      this.commonService.selectedTab != 'Details';
    return x;
  }
  isShowApprove(): boolean {
    if (this.currentRoute == '/orderPList' || this.currentRoute == '/salesConfirmList') {
      return true;
    } else {
      return false;
    }
  }

  // isShowEdit(): boolean {

  //   var x = this.currentRoute !== '/salesConfirmList' && (this.commonService.selectedTab != 'List')  && this.commonService.selectedTab != 'Details';
  //   if(x){
  //      const queryString =  this.currentRoute.split('?')[1]; // gets 'do=4'

  //       if (queryString) {
  //         const params = new URLSearchParams(queryString);
  //         if (params.has('do')) {
  //           if(this.commonService.selectedTab == 'Form'){
  //     return true
  //           }else{
  //             return false;
  //           }

  //         }
  //       }
  //   }
  //   return  x
  // }
}
