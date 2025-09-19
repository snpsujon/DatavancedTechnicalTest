// angular import
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Login } from 'src/app/Models/login.model';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export default class SignInComponent implements OnInit {

  showPassword = false;
  isShowLoginError:boolean=false;
  loginError:string ='';
  isLoading :boolean=false;
  loginFormData:Login= new Login();
  constructor(private route:Router,private dataService:HttpClientConnectionService){

  }
  ngOnInit(): void {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;  // Toggle the value
  }
  async OnSubmit(){
    this.isLoading =true;

      if(this.loginFormData.userName != '' || this.loginFormData.password != ''){
      await this.dataService.PostData('Administrator/Login',this.loginFormData).subscribe((data:any)=>{
          localStorage.setItem('token',data.tokenString);
          localStorage.setItem('userId',data.id);
          this.route.navigate(['/analytics']);
          this.isLoading = false;
        },
      (error:HttpErrorResponse)=>{
        if(error.status == 400){
          this.loginError = "Invalid UserName Or Password";
        }
        else{
          this.loginError = "Internal Server Error";
        }
        this.isLoading  = false;
      
        this.isShowLoginError =true;
        setTimeout(() => {
          this.isShowLoginError =false;
        }, 3000);
      }
      )
   
      } 

    
   
  }
}
