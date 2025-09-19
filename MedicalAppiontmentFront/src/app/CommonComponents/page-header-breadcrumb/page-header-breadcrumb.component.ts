import { Component, Input } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-page-header-breadcrumb',
  templateUrl: './page-header-breadcrumb.component.html',
  styleUrl: './page-header-breadcrumb.component.scss'
})
export class PageHeaderBreadcrumbComponent {
 constructor(public commonService:CommonService){

 } 
}
