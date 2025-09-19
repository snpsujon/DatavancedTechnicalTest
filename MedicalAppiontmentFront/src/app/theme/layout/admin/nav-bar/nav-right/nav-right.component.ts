// Angular Import
import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

// bootstrap
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { NavigationEnd, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent implements OnInit{
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
loggedUserInfo :any;
  // constructor
  constructor(private dataService:HttpClientConnectionService,private router:Router,private toastr:ToastrService) {
    this.visibleUserList = false;
    this.chatMessage = false;
  }
  ngOnInit(): void {
   this.getLoggedUserInfo();
  }
  getLoggedUserInfo(){
    // debugger;
    var id =localStorage.getItem('userId');
    if(id){
      this.dataService.GetData('Administrator/GetUserById?id='+id).subscribe((data:any)=>{
        debugger;
      this.loggedUserInfo = data.data
    },
    (error:HttpErrorResponse)=>{
      // this.toastr.error('You are not Auth to Access this Resource','Please Login');
      // this.router.navigate(['/']);

debugger;
      //get the current url
      // this.router.navigate([`${this.router.url}`]);
      this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
           this.router.navigate([`/${event.url}`]);
        // Parse the URL
       
      }
    });
    }
  )
}else{
  this.router.navigate(['/'])
}
  }
  // public method
  onChatToggle(friendID: number) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }
}
