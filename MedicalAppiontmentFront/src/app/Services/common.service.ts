import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { DD_Menu } from '../Models/drodown.model';
import { createUrl } from 'src/utility/common';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  [key: string]: any;
  dataList: any[] = [];
  formHeaderName: string = '';
  isSearchVisibleOnListPage: boolean = false;
  // Declaration of all Dropdown List start
  DD_Menu: DD_Menu[] = [];
  // Declaration of all Dropdown List end

  iSButtonManagementComponentFormShow: boolean = true;

  constructor(private location: Location, private http: HttpClient, private toastr: ToastrService) {}

  // Back button logic
  BackButton() {
    this.location.back();
  }

   getDropDownData(flag: number) {
    return this.GetDataById(`Administrator/GetDropdownData?flag=${flag}`);
  }

getPermissionData(route:string){
    var uri = createUrl(`ManageMenuPermission/PermisionGetByRoute?route=${route}`);
    return this.http.get(`${uri}`).pipe(
      catchError((error) => {
        console.error('API error:', error);
        this.toastr.error('An error occurred while fetching data', 'Error');
        return throwError(() => error);
      })
    );
}
  formatDate(date: string | Date): string {
    if (!date) return ''; // Handle undefined or null values

    // If date is already a Date object, convert it to YYYY-MM-DD format
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]; 
    }

    // If date is a string (from API), convert it to a Date object first
    const parsedDate = new Date(date);
    
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date format:", date);
      return ''; // Handle invalid date formats gracefully
    }

    return parsedDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD
  }


  // Method to fetch data by ID
  GetDataById(endpoint: string) {
    endpoint = createUrl(endpoint)
    return this.http.get(`${endpoint}`).pipe(
      catchError((error) => {
        console.error('API error:', error);
        this.toastr.error('An error occurred while fetching data', 'Error');
        return throwError(() => error);
      })
    );
  }
  getDropDownDataFor(flag: number,fors:string) {
    return this.GetDataById(`Administrator/GetDropdownData?flag=${flag}&statusFor=${fors}`);
  }

  
}


