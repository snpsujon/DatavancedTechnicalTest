import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, AfterViewInit } from '@angular/core';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { DefaultGridButtonShow, GridButtonShow, GridColumn } from './Models/GridModels';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonService } from 'src/app/Services/common.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dynamic-grid-with-pagination',
  templateUrl: './dynamic-grid-with-pagination.component.html',
  styleUrls: ['./dynamic-grid-with-pagination.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition(':enter', [animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-10px)' }))])
    ])
  ]
})
export class DynamicGridWithPaginationComponent<T> implements OnInit {
  // @Input() data: T[] = []; // Input for the data to display
  @Input() data: T[] = [];
  @Input() columns: GridColumn<T>[] = []; // Column definitions
  @Input() pageSizes: any[] = [50, 100, 'All']; // Configurable page sizes
  @Input() pageSize: number = 50; // Default page size
  @Input() reloadCount: number = 0; // Default page size
  @Input() maxVisiblePages: number = 3; // Maximum visible pages for pagination
  @Input() totalRecords: number = 0; // Maximum visible pages for pagination
  @Input() buttonShow: GridButtonShow<T> = new DefaultGridButtonShow<T>(); // Show buttons based on the configuration\
  @Input() paginationAPI: string = '';
  @Input() haveQueryPram: boolean = false;
  @Input() isUseData: boolean = false;
  @Input() isSearchShow: boolean = true;
  @Input() isShowSum: boolean = false;
  @Input() sumColumn: any[] = [];
  @Input() searchGrid: any[] = [];
  @Input() searchApi: string = '';
  @Input() isSearchGrid: boolean = false;
  @Input() isPostApi: boolean = false;
  @Input() isTakeSkipChange: boolean = false;
  @Input() postDatas: any = {};
  @Output() dataEmitter = new EventEmitter<{ value: any; fieldName?: any; emiter?: any }>();
  @Output() dataChange = new EventEmitter<any>();
  @Output() searchSubmit = new EventEmitter<any>();
  @Output() changeTakeSkip = new EventEmitter<boolean>();
  @Input() isShowCheckBox: boolean = true;
  @Input() isCheckPermission: boolean = true;
  @Input() isAppsApiCall: boolean = false;
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 0;
  startItem: number = 1;
  endItem: number = 1;
  paginatedData: T[] = [];
  pages: (number | string)[] = [];
  sortColumn: keyof T | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filteredData: T[] = [];
  selectedItems: Set<T> = new Set();
  isAllSelected: boolean = false;
  selectedItemIds: number[] = [];
  isSubmitting: boolean = false;
  isGridLoading: boolean = false;
  private destroy$ = new Subject<void>();
  searchFormData: any = [];
  ngOnInit() {
    if (!this.pageSizes.includes(this.pageSize)) {
      this.pageSizes.push(this.pageSize);
      this.pageSizes.sort((a, b) => a - b); // Optional: Sort the array
    }
    this.pageChangeDynamic();
    this.filteredData = [...this.data];
    this.updatePagination();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reloadCount'] && !changes['reloadCount'].isFirstChange()) {
      // Trigger reload when API changes
      this.ngOnInit();
    }
    if (changes['searchGrid'] && !changes['searchGrid'].isFirstChange()) {
    }
  }

  constructor(
    private dataService: HttpClientConnectionService,
    private router: Router,
    public GridHandlerService: GridHandlerService,
    private CommonService: CommonService
  ) {
    this.GridHandlerService.searchToggle$
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribes when component is destroyed
      .subscribe(async (data: any) => {
        if (!this.isSubmitting) {
          // Prevent multiple submissions
          this.isSubmitting = true;

          try {
            this.toggleSearch();
          } catch (error) {
            console.error('Error during submission:', error);
          } finally {
            this.isSubmitting = false; // Reset flag after completion
          }
        }
      });
  }

  // Handle sorting
  sortTable(column: keyof T) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filteredData.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    this.updatePagination();
  }

  isSearchVisible = false;
  isButtonClicked = false;
  expandSearch() {
    this.isButtonClicked = true;
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }
  // Handle pagination
  updatePagination() {
    this.totalItems = this.totalRecords;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.startItem = (this.currentPage - 1) * this.pageSize + 1;
    this.endItem = Math.min(this.startItem + this.pageSize - 1, this.filteredData.length);
    this.paginatedData = this.filteredData;
    this.updatePages();
  }
  // Update page numbers
  updatePages() {
    this.pages = [];
    if (this.totalPages <= this.maxVisiblePages) {
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else {
      this.pages.push(1);
      if (this.currentPage > 2) this.pages.push('...');
      const startPage = Math.max(2, this.currentPage - 1);
      const endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
      for (let i = startPage; i <= endPage; i++) this.pages.push(i);
      if (this.currentPage < this.totalPages - 1) this.pages.push('...');
      this.pages.push(this.totalPages);
    }
  }
  pageChangeDynamic() {
    setTimeout(() => {
      this.isGridLoading = false;
      const skip = (this.currentPage - 1) * this.pageSize;
      const take = this.pageSize;
      if (this.isPostApi) {
        if (this.isTakeSkipChange) {
          this.postDatas.take = 50;
          this.postDatas.skip = 0;
          this.currentPage = 1;
          this.totalRecords = 0;
        } else {
          this.postDatas.take = take;
          this.postDatas.skip = skip;
        }

        this.postData(this.postDatas);
        return;
      }
      if (!this.isUseData) {
        this.getData({ take: take, skip: skip });
      } else {
        this.totalRecords = this.data.length;
        this.filteredData = this.data.slice(skip, skip + take);
        this.updatePagination();
      }
    }, 500);
  }
  postData(data: any) {
    this.dataService.PostData(this.paginationAPI, data).subscribe(
      (response: any) => {
        debugger;
        if (response) {
          if (response.data) {
            this.data = response.data;
            this.totalRecords = response.data[0]?.totalRecords ?? response.data.length;
          } else {
            this.data = response;
            this.totalRecords = response[0]?.totalRecords ?? response.length;
          }
          // this.pageSizes.push('All');
          this.filteredData = [...this.data];
          this.updatePagination();
        } else {
          this.data = [];
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Failed to get data:', error);
        if (error.error.message == 'You are not authorized! Please log in to access this resource.') {
          this.router.navigate(['/']);
        }
      }
    );
  }
  getData = ({ take, skip }: { take: number; skip: number }) => {
    const api = this.haveQueryPram ? `${this.paginationAPI}&take=${take}&skip=${skip}` : `${this.paginationAPI}?take=${take}&skip=${skip}`;
    // Call the API with `take` and `skip` as query parameters
    var apisReturn = this.dataService.GetData(api);
    if (this.isAppsApiCall) {
      apisReturn = this.dataService.GetAppsData(api);
    }
    apisReturn.subscribe(
      (response: any) => {
        if (response) {
          if (response.data) {
            this.data = response.data;
            this.totalRecords = response.data[0]?.totalRecords ?? response.data.length;
          } else {
            this.data = response;
            this.totalRecords = response[0]?.totalRecords ?? response.length;
          }
          // this.pageSizes.push('All');
          this.filteredData = [...this.data];
          this.updatePagination();
        } else {
          this.data = [];
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Failed to get data:', error);
        if (error.error.message == 'You are not authorized! Please log in to access this resource.') {
          this.router.navigate(['/']);
        }
      }
    );
  };
  // Navigate to a specific page
  goToPage(page: any) {
    if (page !== '...') {
      this.isGridLoading = true;
      this.currentPage = page;
      this.isTakeSkipChange = false;
      this.changeTakeSkip.emit(this.isTakeSkipChange);

      this.pageChangeDynamic();
      // this.updatePagination();
    }
  }
  changePageSize(evt: any) {
    debugger;
    this.pageSize = evt.target.value;
    this.pageSize = typeof this.pageSize === 'string' && this.pageSize === 'All' ? this.totalRecords : this.pageSize;
    this.isTakeSkipChange = false;
    this.changeTakeSkip.emit(this.isTakeSkipChange);
    this.pageChangeDynamic();
  }
  // Navigate to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.isGridLoading = true;
      this.currentPage++;
      this.isTakeSkipChange = false;
      this.changeTakeSkip.emit(this.isTakeSkipChange);
      this.pageChangeDynamic();
      // this.updatePagination();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.isGridLoading = true;
      this.currentPage--;
      this.isTakeSkipChange = false;
      this.changeTakeSkip.emit(this.isTakeSkipChange);
      this.pageChangeDynamic();
      // this.updatePagination();
    }
  }
  // Search functionality
  onSearch(evnt: any) {
    const searchTerm = evnt.target.value.trim();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Filter data based on the search term
    this.filteredData = this.data.filter((item) =>
      this.columns.some((column) => {
        if (column.isShow !== false) {
          // Only search visible columns
          const value = item[column.key];
          return value !== null && value !== undefined && String(value).toLowerCase().includes(lowerCaseSearchTerm);
        }
        return false;
      })
    );
    // Reset to the first page after filtering
    this.currentPage = 1;
    this.updatePagination();
  }
  // Toggle selection of all items
  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    if (this.isAllSelected) {
      // Add all currently paginated items to the selected set
      this.paginatedData.forEach((item) => this.selectedItems.add(item));
      this.paginatedData.forEach((item) => this.selectedItemIds.push((item as any)['id']));
      this.GridHandlerService.checkBoxSelectedData = this.selectedItemIds;
    } else {
      // Remove all currently paginated items from the selected set
      this.paginatedData.forEach((item) => this.selectedItems.delete(item));
      this.selectedItemIds = [];
      this.GridHandlerService.checkBoxSelectedData = [];
    }
  }
  // Toggle selection of an individual item
  toggleUserSelection(item: T) {
    const itemId = (item as any)['id'];

    if (this.selectedItems.has(item)) {
      // If the item is already selected, remove it
      this.selectedItems.delete(item);

      // Remove the item ID from selectedItemIds
      this.selectedItemIds = this.selectedItemIds.filter((id) => id !== itemId);
    } else {
      // Otherwise, add it to the selected set
      this.selectedItems.add(item);

      // Add only the selected item's ID, not all paginated data
      this.selectedItemIds.push(itemId);
    }

    // Update the checkBoxSelectedData to match selectedItemIds
    this.GridHandlerService.checkBoxSelectedData = [...this.selectedItemIds];

    // Update the "Select All" checkbox state
    this.isAllSelected = this.paginatedData.every((item) => this.selectedItems.has(item));
  }

  getImageSrc(data: any) {
    if (data) {
      return data.result;
    }
  }
  onValueReceived(eventData: { value: any; fieldName?: any; emiter?: any }) {
    eventData.emiter(eventData);
  }

  onValueChangeOnGread(event: any, emitter: any, fieldName: any) {
    {
      emitter({ value: event.target.value, fieldName: fieldName });
    }
  }
  onValueChangeonGrid(event: any, row: any, column: any) {
    const index = this.paginatedData.findIndex((r: any) => r === row);
    if (index !== -1) {
      row[column] = event.target.value;
      this.paginatedData[index] = row;
    }
    this.dataChange.emit({ value: this.paginatedData, index: index, fieldName: column });
  }
  onValueSubmitOnGrid() {
    this.searchSubmit.emit(this.searchFormData);
  }
  onValueChangedAutoSelect(eventData: { value: any; fieldName?: any; text?: any; showField?: any; emiter?: any }) {
    eventData.emiter(eventData);
  }

  doSum(column: string, dataSource: any[]) {
    return dataSource.reduce((sum, item) => {
      // this.getSummaryRow(item);
      const value = Number(item[column]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
  }
  //   getSummaryRow(summaryData: any){
  // debugger
  // const totalColumnCount = this.columns.filter(column =>
  //   column.isShow !== false
  // ).length;
  // const row = Array(totalColumnCount).fill('');

  //   }
  makeSumRow() {
    const totalColumnCount = this.columns.filter((column) => column.isShow !== false).length + 3;
    const row = Array(totalColumnCount).fill(null);

    let column: any = '';
    // let getSumColumn = this.sumColumn.find((col:any) => col.key === item.key);
    this.columns.forEach((itemss: any, i) => {
      if (this.sumColumn.find((col: any) => col.key === itemss.key)) {
        row[i + 2] = this.doSum(itemss.key, this.paginatedData);
      }
    });

    console.log(row);
    const startIndex = row.findIndex((x) => x !== null);

    console.log(startIndex); // Output: 3

    row[startIndex - 1] = 'Summary';

    // if(getSumColumn !== undefined){
    //   let sumColumnPosition = getSumColumn.position;
    //   if((i+2) == sumColumnPosition){

    //     row[i+3] = this.paginatedData.reduce((sum: number, item:any) => {
    //       const value = Number(item[getSumColumn.key]);
    //       return sum + (isNaN(value) ? 0 : value);
    //     }, 0);

    //   }
    // }

    // row[i] = item;
    return row;
  }
}
