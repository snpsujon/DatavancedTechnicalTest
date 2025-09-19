import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  public connection : HubConnection = new HubConnectionBuilder()
  .withUrl(environment.signalRUrl)
  .configureLogging(LogLevel.Information)
  .build();


  constructor() {
    this.start();  
    // this.connection.on('GiveLatLon', (data: any) => {
    //   console.log("Received data from server:", data);
    // });  
   }
   
  //start connection
  public async start(){
    try {
      await this.connection.start();
      console.log("Connection is established!")
    } catch (error) {
      console.log(error);
    }
  } 
  public async OnConnectedUser(userId:string){
    return await this.connection.invoke('OnConnectedUser',userId,'Web');
  }
}
