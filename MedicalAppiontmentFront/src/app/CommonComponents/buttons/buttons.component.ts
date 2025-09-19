import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DxTabsComponent } from 'devextreme-angular';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import Swal from 'sweetalert2';
import { CommonService } from '../../Services/common.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss'
})
export class ButtonsComponent implements OnInit {
  @Input() isAdd: boolean = true;
  @Input() isEdit: boolean = true;
  @Input() isDelete: boolean = true;
  @Input() isDetails: boolean = true;
  @ViewChild('withText') withText!: DxTabsComponent;
  permissionData :any =[];
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

  currentRoute: string = '';
  constructor(
    private dataService: HttpClientConnectionService,
    private router: Router,
    public GridHandlerService: GridHandlerService,
    private activatedRoute: ActivatedRoute,
    private common: CommonService
  ) {
    this.currentRoute = this.router.url;
    this.changeInitTab();
     this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        // Parse the URL
       this.changeInitTab();
      }
    });
  }

  changeInitTab(){
    debugger;
 const queryString = this.currentRoute.split('?')[1]; // gets 'do=4'

        if (queryString) {
          const params = new URLSearchParams(queryString);
          if (params.has('do')) {
            if (this.GridHandlerService.selectedTab == 'Form') {
              this.GridHandlerService.selectedTab = 'Edit';
            }
          }
        }
        this.common.getPermissionData(this.router.url.split('?')[0]).subscribe((data: any) => {
      this.permissionData = data.data;
    });
        if (this.currentRoute == '/orderPList' || this.currentRoute == '/deliveryOrderPList') {
          this.GridHandlerService.selectedTab = 'PList';
        }
  }
  ngOnInit(): void {
    if (this.currentRoute == '/orderPList' || this.currentRoute == '/deliveryOrderPList') {
      this.GridHandlerService.selectedTab = 'PList';
    }
  }

   isShowEdit(): boolean {
    var x =
      this.currentRoute !== '/salesConfirmList' &&
      this.GridHandlerService.selectedTab != 'List' &&
      this.GridHandlerService.selectedTab != 'Form' &&
      this.GridHandlerService.selectedTab != 'Details';
    return x;
  }
  selectTab(tab: string): void {
    if (tab == 'Save' || tab == 'Delete' || tab == 'GMR') {
      if (tab == 'Save') {
        this.GridHandlerService.addNew();
      } else if (tab == 'GMR') {
        this.GridHandlerService.generateMR();
      } else {
        if (this.GridHandlerService.checkBoxSelectedData.length > 0) {
          Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete selected record',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
          }).then((result) => {
            if (result.value) {
              this.GridHandlerService.delete();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire('Cancelled', 'Your record is safe :)', 'error');
              this.GridHandlerService.checkBoxSelectedData = [];
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
        // if (this.GridHandlerService.checkBoxSelectedData.length > 0) {
        //   if (confirm("Are you sure to delete selected record(s)?") == true) {
        //     this.GridHandlerService.delete();
        //   }

        // } else {
        //   alert("Please select record to delete");
        // }
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
      this.GridHandlerService.approve();
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
      this.GridHandlerService.selectedTab = tab;
    }
  }

  isShowSearch(): boolean {
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
    if (minorTab == 'List' || minorTab === 'PList') {
      return true;
    } else {
      return false;
    }
  }
  isShowDelete(): boolean {
    if (this.GridHandlerService.checkBoxSelectedData.length > 0) {
      if (this.currentRoute === 'orderList') {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  isShowNew(): boolean {
    const fullUrl = this.router.url.split('?')[0]; // e.g. "/userForm"
    const routeSegment = fullUrl.split('/')[1];

    let minorTab = '';
    minorTab = routeSegment.includes('PList')
      ? 'PList'
      : routeSegment.includes('Form')
        ? 'Form'
        : routeSegment.includes('List')
          ? 'List'
          : 'PList';

    // ✅ Get the 'do' query param
    const queryString = this.router.url.split('?')[1];
    const queryParams = new URLSearchParams(queryString);
    const doParam = queryParams.get('do'); // null if not present

    // ✅ Logic
    if ((minorTab === 'List' || (!!doParam && doParam.trim() !== '') || minorTab === 'PList') && fullUrl !== '/attendanceList') {
      if(this. permissionData.IsAdd){
        return true;
      }
      return false;
    } else {
      return false;
    }
  }
  isShowSave(): boolean {
    if (this.GridHandlerService.selectedTab == 'Form' || this.GridHandlerService.selectedTab == 'Edit') {
      return true;
    } else {
      return false;
    }
  }

  isShowCancel(): boolean {
    if (this.GridHandlerService.selectedTab == 'Form') {
      return true;
    } else {
      return false;
    }
  }

  toggleSearch() {
    this.GridHandlerService.toggleSearch();
  }

  isShowApprove(): boolean {
    var cur = this.currentRoute;
    if (
      (this.currentRoute == '/orderPList' || this.currentRoute == '/sampleOrderPList') &&
      this.GridHandlerService.checkBoxSelectedData.length > 0
    ) {
      //       currentRoute == '/orderList' ||
      //       currentRoute.startsWith('/orderForm') ||
      //       currentRoute.startsWith('/orderList')

      return true;
    } else {
      return false;
    }
  }
}
