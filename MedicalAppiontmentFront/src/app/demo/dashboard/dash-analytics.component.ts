// angular import
import { Component, ViewChild } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApexTheme, NgApexchartsModule } from 'ng-apexcharts';


import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexPlotOptions,
  ApexTooltip,
  ApexMarkers
} from 'ng-apexcharts';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { DynamicGridWithPaginationComponent } from 'src/app/CommonComponents/dynamic-grid-with-pagination/dynamic-grid-with-pagination.component';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ProductSaleComponent } from './product-sale/product-sale.component';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  fill: ApexFill;
  grid: ApexGrid;
  markers: ApexMarkers;
  theme: ApexTheme;
};

@Component({
  selector: 'app-dash-analytics',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule, ProductSaleComponent],
  templateUrl: './dash-analytics.component.html',
  styleUrls: ['./dash-analytics.component.scss']
})
export default class DashAnalyticsComponent {
  // public props
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('customerChart') customerChart!: ChartComponent;
  chartOptions!: Partial<ChartOptions>;
  chartOptions_1!: Partial<ChartOptions>;
  chartOptions_2!: Partial<ChartOptions>;
  chartOptions_3!: Partial<ChartOptions>;

  years: number[] = [];
  // selectedYear: number;
  // selectedMonth: number;
  startDate: Date = new Date()
  endDate: Date = new Date()
  SummaryData: any;


  selectedFilter: string = 'today';
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();



  productListAPI: string = 'Administrator/GetTopSellingProduct';
  pharmacyListAPI: string = 'Administrator/GetTopSellingPharmacy';
  haveQueryPram: boolean = false;
  reloadCount: number = 0;
  productColumns = [
    {
      title: 'Product Name',
      key: 'productName'
    },
    {
      title: 'Product Code',
      key: 'productCode'
    },
    {
      title: 'Pack Size',
      key: 'packSize'
    },
    {
      title: 'Total Order Qty',
      key: 'orderssQty'
    },
    {
      title: 'Total Order Amount',
      key: 'orderttp'
    }

  ];
  productData: any = [];

  pharmacyColumns = [
    {
      title: 'Pharmacy Name',
      key: 'pharmacyName'
    },
    {
      title: 'Pharmacy Code',
      key: 'pharmacyCode'
    },
    {
      title: 'Address',
      key: 'address'
    },
    {
      title: 'Territory',
      key: 'territory'
    },
    {
      title: 'Order Qty',
      key: 'totalOrderQty'
    },

    {
      title: 'Order Value',
      key: 'orderttp'
    },

    {
      title: 'Return Qty',
      key: 'totalReturnQty'
    },
    {
      title: 'Return Amount',
      key: 'returnAmount'
    },
    {
      title: 'Discount Amount',
      key: 'discountAmount'
    },


    {
      title: 'Total Sales Amount',
      key: 'actualSale'
    }

  ];
  pharmacyData: any = [];
  dipotColumns = [
    {
      title: 'Product Name',
      key: 'productName'
    },
    {
      title: 'Product Code',
      key: 'productCode'
    },
    {
      title: 'Pack Size',
      key: 'packSize'
    },
    {
      title: 'Total Order Qty',
      key: 'orderssQty'
    },
    {
      title: 'Total Order Amount',
      key: 'orderttp'
    }

  ];
  depotData: any = [];
  mioColumns = [
    {
      title: 'Product Name',
      key: 'productName'
    },
    {
      title: 'Product Code',
      key: 'productCode'
    },
    {
      title: 'Pack Size',
      key: 'packSize'
    },
    {
      title: 'Total Order Qty',
      key: 'orderssQty'
    },
    {
      title: 'Total Order Amount',
      key: 'orderttp'
    }

  ];
  mioData: any = [];


  getDashboardSummaryAPI: string = 'Administrator/GetDashboardSummary';
  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  //years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  // constructor
  constructor(private dataService: HttpClientConnectionService,) {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Generate a range of years (e.g., current year ±5)
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      this.years.push(year);
    }

    this.selectedYear = currentYear;
    this.selectedMonth = currentMonth;

    this.dateChange();

    this.chartOptions = {
      chart: {
        height: 205,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      series: [
        {
          name: 'Arts',
          data: [20, 50, 30, 60, 30, 50]
        },
        {
          name: 'Commerce',
          data: [60, 30, 65, 45, 67, 35]
        }
      ],
      legend: {
        position: 'top'
      },
      xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000'],
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        show: true,
        min: 10,
        max: 70
      },
      colors: ['#73b4ff', '#59e0c5'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          gradientToColors: ['#4099ff', '#2ed8b6'],
          shadeIntensity: 0.5,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      grid: {
        borderColor: '#cccccc3b'
      }
    };
    this.chartOptions_1 = {
      chart: {
        height: 150,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%'
          }
        }
      },
      labels: ['New', 'Return'],
      series: [39, 10],
      legend: {
        show: false
      },
      tooltip: {
        theme: 'dark'
      },
      grid: {
        padding: {
          top: 20,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      colors: ['#4680ff', '#2ed8b6'],
      fill: {
        opacity: [1, 1]
      },
      stroke: {
        width: 0
      }
    };
    this.chartOptions_2 = {
      chart: {
        height: 150,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%'
          }
        }
      },
      labels: ['New', 'Return'],
      series: [20, 15],
      legend: {
        show: false
      },
      tooltip: {
        theme: 'dark'
      },
      grid: {
        padding: {
          top: 20,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      colors: ['#fff', '#2ed8b6'],
      fill: {
        opacity: [1, 1]
      },
      stroke: {
        width: 0
      }
    };
    this.chartOptions_3 = {
      chart: {
        type: 'area',
        height: 145,
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#ff5370'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#ff869a'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 0.8,
          stops: [0, 100, 100, 100]
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      series: [
        {
          data: [45, 35, 60, 50, 85, 70]
        }
      ],
      yaxis: {
        min: 5,
        max: 90
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        marker: {
          show: false
        }
      }
    };
  }

  cards: any = [];

  images = [
    {
      src: 'assets/images/gallery-grid/img-grd-gal-1.jpg',
      title: 'Old Scooter',
      size: 'PNG-100KB'
    },
    {
      src: 'assets/images/gallery-grid/img-grd-gal-2.jpg',
      title: 'Wall Art',
      size: 'PNG-150KB'
    },
    {
      src: 'assets/images/gallery-grid/img-grd-gal-3.jpg',
      title: 'Microphone',
      size: 'PNG-150KB'
    }
  ];


  // dateChange() {
  //   console.log(this.selectedYear, this.selectedMonth);
  //   debugger
  //   this.startDate = new Date(this.selectedYear, this.selectedMonth - 1, 2);
  //   this.endDate = new Date(this.selectedYear, this.selectedMonth, 1);

  //   console.log('Start Date:', this.startDate.toISOString());
  //   console.log('End Date:', this.endDate.toISOString());





  //   this.getDashboardSummary();
  //   this.getProductLists();
  //   this.getPharmacyLists();


  //   // Optional: Do something with startDate and endDate (e.g., API call)
  // }

  dateChange() {

     

    switch (this.selectedFilter) {
      case 'today':
        this.startDate = new Date();
        this.endDate = new Date();

        this.SearchFunction();
        break;

      case 'yesterday':
        this.startDate = new Date();
        this.endDate = new Date();
        this.startDate.setDate(this.startDate.getDate() - 1);
        this.SearchFunction();
        
        break;

      case 'last7days':
        this.startDate = new Date();
        this.startDate.setDate(this.startDate.getDate() - 6); // last 7 days includes today
        this.endDate = new Date();
        this.SearchFunction();
        break;

      case 'monthly':
        this.startDate = new Date(this.selectedYear, this.selectedMonth - 1, 2);
        this.endDate = new Date(this.selectedYear, this.selectedMonth, 1);
        this.SearchFunction();
        break;

      case 'yearly':
        this.startDate = new Date(this.selectedYear, 0, 1);
        this.endDate = new Date(this.selectedYear, 11, 31);
        this.SearchFunction();
        break;

      default:
        this.startDate = new Date();
        this.endDate = new Date();
        this.SearchFunction();
        break;
    }
  }

SearchFunction() {
  this.getDashboardSummary();
  this.getProductLists();
  this.getPharmacyLists();
}


  onFilterChange() {
    this.dateChange();
    // if (this.selectedFilter === 'today' || this.selectedFilter === 'yesterday' || this.selectedFilter === 'last7days') {
    //   this.dateChange();
    // }
  }



  getProductLists() {
    this.dataService.GetData(`${this.productListAPI}?startDate=` + this.startDate.toISOString() + `&endDate=` + this.endDate.toISOString()).subscribe((data: any) => {
      this.productData = data;
    })
  }
  getPharmacyLists() {
     
    this.dataService.GetData(`${this.pharmacyListAPI}?startDate=` + this.startDate.toISOString() + `&endDate=` + this.endDate.toISOString()).subscribe((data: any) => {
      this.pharmacyData = data;
    })
  }

  getDashboardSummary() {
    this.dataService.GetData(`${this.getDashboardSummaryAPI}?startDate=` + this.startDate.toISOString() + `&endDate=` + this.endDate.toISOString()).subscribe((data: any) => {

      //this.SummaryData = data.data;
      this.cards = [
        {
          background: 'bg-c-blue',
          title: 'Total Invoice Value',
          icon: 'fa fa-file',
          number: `৳${data.invoiceValue}`,

        },
        {
          background: 'bg-c-green',
          title: 'Total Actual Sales',
          icon: 'fas fa-money-check-alt',
          number: `৳${data.actualSales}`,
        },
        {
          background: 'bg-c-yellow',
          title: 'Total In Transit',
          icon: 'fa fa-truck',
          number: `৳${data.inTransit}`,
        },
        {
          background: 'bg-c-red',
          title: 'Total Order Discount',
          icon: 'fas fa-percentage',
          number: `৳${data.discount}`,
        },

        {
          background: 'bg-c-yellow',
          title: 'Total Return Amount',
          icon: 'fas fa-exchange-alt',
          number: `৳${data.returnAmount}`,
        },

        {
          background: 'bg-c-green',
          title: 'Total Payment Amount',
          icon: 'fas fa-file-invoice-dollar',
          number: `৳${data.paymentAmount}`,
        },

        {
          background: 'bg-c-red',
          title: 'Total MR Discount',
          icon: 'fab fa-google-wallet',
          number: `৳${data.mrDis}`,
        },

        {
          background: 'bg-c-blue',
          title: 'Total AIT Amount',
          icon: 'fab fa-ethereum',
          number: `৳${data.ait}`,
        },

        {
          background: 'bg-c-red',
          title: 'Total Due Amount',
          icon: 'fas fa-hand-holding-usd',
          number: `৳${data.dueAmount}`,
        },
        {
          background: 'bg-c-blue',
          title: 'Total Order Qty',
          icon: 'fas fa-equals',
          number: `${data.TotalOrderQty}`,
        },

        {
          background: 'bg-c-red',
          title: 'Total Return Qty',
          icon: 'fas fa-history',
          number: `${data.TotaReturnQty}`,
        }





      ];

      console.log(data);
    })
  }



}
