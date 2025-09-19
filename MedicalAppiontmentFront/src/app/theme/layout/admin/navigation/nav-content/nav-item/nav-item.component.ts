// Angular Import
import { Component, Input } from '@angular/core';

// project import
import { NavigationItem } from '../../navigation';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
  constructor(private gridService:GridHandlerService,private router:Router){}
  // public props
  @Input() item!: NavigationItem;

  // public method
  closeOtherMenu(event: MouseEvent) {
    const ele = event.target as HTMLElement;
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement as HTMLElement;
      const up_parent = ((parent.parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
      const last_parent = up_parent.parentElement;
      const sections = document.querySelectorAll('.pcoded-hasmenu');
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
        sections[i].classList.remove('pcoded-trigger');
      }

      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
    if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('mob-open');
    }
    this.gridService.selectedTab = "List";
  }
  onRouting(uri:any){
    
    if(uri == '/orderPList' || uri == '/deliveryOrderPList' || uri == '/invPList' || uri == '/mrPList'){
      this.gridService.selectedTab = 'PList'
    }else{
      this.gridService.selectedTab = 'List';
    }



    // this.gridService.selectedTab = "List";
  
  //   const decodedUri = decodeURIComponent(uri);
  //   const [path, queryString] = decodedUri.split('?');

  // // Convert query string into an object
  // const queryParams = new URLSearchParams(queryString);

  // const uu = this.getParams(decodedUri);

  //   // ['/search'], { queryParams: { category: 'electronics', page: 2 } }
  //   this.router.navigate([uu.path], { queryParams: uu.params });


  
    this.router.navigate([uri]);
    

  }
  getDecodedUrl(): string {
    return decodeURIComponent(this.item?.url || '');
  }

  getParams(url: string) {
    const [path, queryString] = url.split('?');
    const params = new URLSearchParams(queryString);
    const paramObj: any = {};
    
    params.forEach((value, key) => {
      paramObj[key] = value;
    });
  
    return { path, params: paramObj };
  }
  getLink(uri: string) {
    const data = this.getParams(uri);
    return data.path;
  }
  getParamsObj(uri: string) {
    const data = this.getParams(uri);
    return data.params;
  }
  

}
