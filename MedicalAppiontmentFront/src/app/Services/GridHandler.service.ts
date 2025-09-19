import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { GridButtonShow, GridCaption, GridDataModel, GridDataShow } from '../Models/GridModels';

@Injectable({
  providedIn: 'root'
})
export class GridHandlerService {
  selectedTab:string="List";
  checkBoxSelectedData: any[] = [];
  isLoadPanelVisible:boolean=false;
  private dataSubject = new Subject<any>();
  data$ = this.dataSubject.asObservable();

  private detailsSubject = new Subject<any>();
  details$ = this.detailsSubject.asObservable();
  private editSubject = new Subject<any>();
  edit$ = this.editSubject.asObservable();
  private addSubject = new Subject<any>();
  add$ = this.addSubject.asObservable();
    private searchToggleSubject = new Subject<any>();
  searchToggle$ = this.searchToggleSubject.asObservable();
  private mrSubject = new Subject<any>();
  mr$ = this.mrSubject.asObservable();
  private backToSalesConfirmSubject = new Subject<any>();
  backToSalesConfirm$ = this.backToSalesConfirmSubject.asObservable();
  private approveSubject = new Subject<any>();
  approve$ = this.approveSubject.asObservable();
  private deleteSubject = new Subject<any>();
  delete$ = this.deleteSubject.asObservable();
  isSearch:boolean=false;
  isPagger:boolean=false; 
  isButtonColumn:boolean=true;
  dataList:any[]=[];
  isShowData:GridDataShow=new GridDataShow();
  isShowButton:GridButtonShow = new GridButtonShow();
  dataField:GridDataModel=new GridDataModel();
  caption:GridCaption= new GridCaption();
  
  constructor() {
    this.edit=this.edit.bind(this);
    this.addPermission=this.addPermission.bind(this)
    this.details=this.details.bind(this);
    this.addNew = this.addNew.bind(this);
    this.approve = this.approve.bind(this);
    this.delete = this.delete.bind(this);
  }
  edit(selectedRecord:any){
    this.editSubject.next(selectedRecord);
  }
  delete() {
    this.deleteSubject.next(this.checkBoxSelectedData);
    
  }
  addNew() {
    this.addSubject.next(NgForm);
  }
  generateMR() {
    this.mrSubject.next(NgForm);
  }
  approve() {
    this.approveSubject.next(this.checkBoxSelectedData);
  }
  backToSalesConfirm(){
    this.backToSalesConfirmSubject.next(this.checkBoxSelectedData);
  }
  details(selectedRecord:any){
    this.detailsSubject.next(selectedRecord);
  }
  addPermission(selectedRecord :any){
    selectedRecord.column.command="permission";
    this.dataSubject.next(selectedRecord);
  }
toggleSearch(){
   
this.searchToggleSubject.next(1);
}
}
