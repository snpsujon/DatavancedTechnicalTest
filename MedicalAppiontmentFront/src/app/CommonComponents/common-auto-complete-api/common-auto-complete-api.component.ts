import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-common-auto-complete-api',
  templateUrl: './common-auto-complete-api.component.html',
  styleUrl: './common-auto-complete-api.component.scss'
})
export class CommonAutoCompleteApiComponent {
  selectedItem: any;
  @Input() selectedValue: any;
  isLoading: boolean = false;
  @Input() dataSource:any = [];
  @Input() valueExpr: string = 'id';
  @Input() displayExpr: string = 'name';
  @Input() api:string = '';
  @Input() flag:number = 0;
  @Input() searchExprOption: string[] = ['name'];
  @Input() minSearchLengthOption: number = 3;
  @Input() disabled: boolean = false;
  @Input() fieldName: string = '';
  @Input() showFieldName: string = '';
  @Input() isReadOnly: boolean = false;
  @Output() valueChange = new EventEmitter<any>();
  @Input() parentEmitter?: EventEmitter<any>;

  constructor(private dataService: HttpClientConnectionService) {
    debugger;
    this.dataSource;
  }

  onValueChanged(event: any) {
    this.selectedItem = this.dataSource.find((x: any) => x[this.displayExpr] === event.value);
    // console.log(this.selectedItem);
    // { value: event.value, fieldName: this.fieldName, emiter: this.parentEmitter }
    if(this.selectedItem){
      // 
      this.valueChange.emit({ value: this.selectedItem[this.valueExpr], fieldName: this.fieldName,text:this.selectedItem[this.displayExpr],showField:this.showFieldName,emiter: this.parentEmitter });
    }
    
  }

  searchCategories = (e: any) => {
    const searchTerm = e.component.option('text'); // Get the input text
    let url = this.makeApiUrl(searchTerm);
    if (searchTerm.length >= 3) {
      this.isLoading = true;
      this.dataService.GetData(url).subscribe((data: any) => {
        // 
        this.dataSource = data;
        this.isLoading = false;
      });
    }else{
      if(searchTerm.length == 0){
        this.valueChange.emit({ value: 0, fieldName: this.fieldName,text:0,showField:this.showFieldName,emiter: this.parentEmitter });
      }
    }
  };

  makeApiUrl(searchTerm: string) {
    let url = `Administrator/GetDropDownBySearchString?flag=${this.flag}&searchText=${searchTerm}`;
    return url;
  }

}
