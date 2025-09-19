// angular import
import { Component, Input, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

interface ProgressBarItem {
  value: string;
  color: string;
  percentage: number;
}

@Component({
  selector: 'app-product-sale',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-sale.component.html',
  styleUrls: ['./product-sale.component.scss']
})
export class ProductSaleComponent{

   @Input() title: any = [];


   
  ngOnInit(): void {
    
  }
  // public method
  // product_sale = [
  //   {
  //     title: 'product Code'
  //   },
  //   {
  //     title: 'Click',
  //     icon: 'icon-help-circle'
  //   },
  //   {
  //     title: 'Cost',
  //     icon: 'icon-help-circle'
  //   },
  //   {
  //     title: 'CTR',
  //     icon: 'icon-help-circle'
  //   },
  //   {
  //     title: 'ARPU',
  //     icon: 'icon-help-circle'
  //   },
  //   {
  //     title: 'ECPI',
  //     icon: 'icon-help-circle'
  //   },
  //   {
  //     title: 'ROI',
  //     icon: 'icon-help-circle'
  //   },
  //   {
  //     title: 'Revenue',
  //     icon: 'icon-help-circle'
  //   },
  //   {
  //     title: 'Conversions',
  //     icon: 'icon-help-circle'
  //   }
  // ];

@Input() data: any = [];

  
}
