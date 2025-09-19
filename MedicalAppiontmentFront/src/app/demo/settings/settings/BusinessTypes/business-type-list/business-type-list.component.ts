import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-business-type-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './business-type-list.component.html',
  styleUrl: './business-type-list.component.scss'
})
export default class BusinessTypeListComponent {

}
