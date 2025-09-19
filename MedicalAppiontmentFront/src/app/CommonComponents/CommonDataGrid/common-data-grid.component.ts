import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { PagerDisplayMode } from 'devextreme/common/grids';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';

@Component({
  selector: 'app-common-data-grid',
  templateUrl: './common-data-grid.component.html',
  styleUrl: './common-data-grid.component.scss'
})
export class CommonDataGridComponent implements OnInit{
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;
  customizeColumns(columns:any) {
    columns[0].width = 70;
  }
  actionName:string="";
  controllerName:string="";

  readonly allowedPageSizes = [10, 30, 50,100];
  displayMode:PagerDisplayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  applyFilterTypes: any;

  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  get isCompactMode() {
    return this.displayMode === 'compact';
  }
  readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];
  constructor(public service:GridHandlerService) {
    this.showFilterRow=true;
    this.showHeaderFilter=true;
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately',
    }, {
      key: 'onClick',
      name: 'On Button Click',
    }];
    this.orderHeaderFilter = this.orderHeaderFilter.bind(this);

   }

  ngOnInit(): void {
  this.service;
  }

  // private static getOrderDay(rowData:any) {
  //   return (new Date(rowData.OrderDate)).getDay();
  // }
  clearFilter() {
    this.dataGrid.instance.clearFilter();
  }
  orderHeaderFilter(data:any) {
    data.dataSource.postProcess = (results:any) => {
      results.push({
        text: 'Weekends',
        value: 'weekends',
      });
      return results;
    };
  }
}
