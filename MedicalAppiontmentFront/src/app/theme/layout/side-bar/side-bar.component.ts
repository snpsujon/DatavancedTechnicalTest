import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, first, throwError } from 'rxjs';
import { createUrl } from 'src/utility/common';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
  
  dataList:any[]=[];
  isProcessGoingOn : boolean = false;

  activeParentItem: any; // Variable to store the active parent item
  activeChildItem: any;

  constructor(
    private http:HttpClient,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.getData();
  }

  public getData() {
    // this.isProcessGoingOn = true;
    let userId = localStorage.getItem("_userId");
    let isAuthenticated = localStorage.getItem("_isAuthenticated");
  
    // Corrected URL construction
    let url = createUrl('ManageMenu/GetMenuByUserId?userId=' + userId + '&isAuthenticated=' + isAuthenticated);
  
    this.http.get(url, { withCredentials: true }).pipe(
      first(),
      catchError(error => {
        console.error('Error fetching data:', error);
        // Handle the error as needed
        return throwError(error);
      })
    ).subscribe(
      (x: any) => {
        this.dataList = x;
        this.isProcessGoingOn = false;         
      }
    );
  }
  

  handleItemClick(menuItem: any) {

    if (menuItem.parentId === 0) {
      this.activeParentItem = menuItem;
    } else {
      this.activeChildItem = menuItem;
      this.activeParentItem = this.dataList.find(item => item.id === menuItem.parentId);
      this.redirectRoute(menuItem)
    }
  }

  redirectRoute(menuItem: any): void {
    if(menuItem.parentId>0 ){
       var data=JSON.stringify(menuItem.bP_Role_Permission[0]);
      this.router.navigate(['/'+menuItem.menuUrl], { queryParams: { values: data } });
    }

  }
  toggleExpanded(dataList: any): void {
    dataList.expanded = !dataList.expanded;

    if(dataList.parentId>0 ){
      var routerData={
        isAdd:dataList.isAdd,
        isView:dataList.isView,
        isDelete:dataList.isDelete,
        isEdit:dataList.isEdit,
        isDetails:dataList.isDetails        
      }
      var data=JSON.stringify(routerData);
      // const encodeValue = CryptoJS.AES.encrypt(data, "values").toString();
     this.router.navigate(['/'+dataList.menuUrl], { queryParams: { values: data } });
   }
  }
  hasChildren(menuItem: any): boolean {
    // Check if there are any items in 'dataList' with this 'menuItem' as their parent
    return this.dataList.some(item => item.parentId === menuItem.id);
  }
  isExpanded(dataList: any): boolean {
    return dataList.expanded;
  }
}
