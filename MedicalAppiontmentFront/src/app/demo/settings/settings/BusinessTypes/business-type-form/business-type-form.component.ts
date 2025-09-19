import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-business-type-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './business-type-form.component.html',
  styleUrl: './business-type-form.component.scss'
})
export default class BusinessTypeFormComponent {

}
