//Devextreme import
import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridModule,
  DxFormModule,
  DxListModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTemplateModule,
  DxTextAreaModule,
  DxTextBoxModule,
  DxTooltipModule,
  DxTreeViewModule,
  DxDateBoxModule,
  DxTagBoxModule,
  DxSchedulerModule,
  DxLoadPanelModule,
  DevExtremeModule,
  DxAccordionModule,
  DxDropDownBoxModule,
  DxScrollViewModule,
  DxContextMenuModule,
  DxDrawerModule,
  DxRadioGroupModule,
  DxTabsModule,
  DxChartModule,
  DxActionSheetModule,
  DxFileUploaderModule,
  DxProgressBarModule,
  DxPopoverModule,
  DxLoadIndicatorModule,
  DxTabPanelModule,
  DxSortableModule
} from 'devextreme-angular';

// Angular Import
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import { ChatMsgComponent } from './theme/layout/admin/nav-bar/nav-right/chat-msg/chat-msg.component';
import { ChatUserListComponent } from './theme/layout/admin/nav-bar/nav-right/chat-user-list/chat-user-list.component';
import { FriendComponent } from './theme/layout/admin/nav-bar/nav-right/chat-user-list/friend/friend.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { SharedModule } from './theme/shared/shared.module';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonDataGridComponent } from './CommonComponents/CommonDataGrid/common-data-grid.component';
import { CommonDataGridWithCheckBoxComponent } from './CommonComponents/CommonDataGridWithCheckBox/common-data-grid-with-check-box.component';
import { ButtonControlComponent } from './CommonComponents/button-control/button-control.component';
import { ToastrModule } from 'ngx-toastr';
import { SideBarComponent } from './theme/layout/side-bar/side-bar.component';

import { MatTreeModule } from '@angular/material/tree';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonSelectBoxComponent } from './CommonComponents/common-select-box/common-select-box.component';
import { DynamicGridWithPaginationComponent } from './CommonComponents/dynamic-grid-with-pagination/dynamic-grid-with-pagination.component';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DxReportViewerModule } from 'devexpress-reporting-angular';
import { CommonAutoCompleteApiComponent } from './CommonComponents/common-auto-complete-api/common-auto-complete-api.component';
import DashAnalyticsComponent from './demo/dashboard/dash-analytics.component';
import { PageHeaderBreadcrumbComponent } from './CommonComponents/page-header-breadcrumb/page-header-breadcrumb.component';
import ButtonComponent from './demo/ui-element/button/button.component';
import { FooterComponent } from './CommonComponents/footer/footer.component';
import { PatientListComponent } from './Components/patient-list/patient-list.component';
import { PatientFormComponent } from './Components/patient-form/patient-form.component';
import { DoctorListComponent } from './Components/doctor-list/doctor-list.component';
import { DoctorFormComponent } from './Components/doctor-form/doctor-form.component';
import { AppointmentListComponent } from './Components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './Components/appointment-form/appointment-form.component';
import { MedicineListComponent } from './Components/medicine-list/medicine-list.component';
import { MedicineFormComponent } from './Components/medicine-form/medicine-form.component';
import { PrescriptionListComponent } from './Components/prescription-list/prescription-list.component';
import { PrescriptionFormComponent } from './Components/prescription-form/prescription-form.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    GuestComponent,
    ConfigurationComponent,
    NavBarComponent,
    NavigationComponent,
    NavLeftComponent,
    NavRightComponent,
    NavSearchComponent,
    ChatMsgComponent,
    ChatUserListComponent,
    FriendComponent,
    NavContentComponent,
    NavItemComponent,
    NavCollapseComponent,
    NavGroupComponent,
    CommonDataGridComponent,
    CommonDataGridWithCheckBoxComponent,
    ButtonControlComponent,
    SideBarComponent,
    CommonSelectBoxComponent,

    DynamicGridWithPaginationComponent,
    CommonAutoCompleteApiComponent,
    PageHeaderBreadcrumbComponent,
    FooterComponent,
    PatientListComponent,
    PatientFormComponent,
    DoctorListComponent,
    DoctorFormComponent,
    AppointmentListComponent,
    AppointmentFormComponent,
    MedicineListComponent,
    MedicineFormComponent,
    PrescriptionListComponent,
    PrescriptionFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxFormModule,
    DxListModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxTemplateModule,
    DxTextAreaModule,
    DxTextBoxModule,
    DxTooltipModule,
    DxTreeViewModule,
    DxDateBoxModule,
    DxTagBoxModule,
    DxSchedulerModule,
    DxLoadPanelModule,
    DevExtremeModule,
    DxAccordionModule,
    DxDropDownBoxModule,
    DxScrollViewModule,
    DxContextMenuModule,
    DxDrawerModule,
    DxRadioGroupModule,
    DxTabsModule,
    DxChartModule,
    DxActionSheetModule,
    DxFileUploaderModule,
    DxProgressBarModule,
    DxPopoverModule,
    DxLoadIndicatorModule,
    DxTabPanelModule,
    DxSortableModule,
    HttpClientModule,
    MatTreeModule,
    MatSelectModule,
    MatTabsModule,
    MatStepperModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgMultiSelectDropDownModule.forRoot(),
    DxReportViewerModule,
    DashAnalyticsComponent,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
      newestOnTop: false
    })
  ],
  providers: [ DatePipe],
  bootstrap: [AppComponent],
  exports: [DxReportViewerModule]
})
export class AppModule {}
