import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDataGridWithCheckBoxComponent } from './common-data-grid-with-check-box.component';

describe('CommonDataGridWithCheckBoxComponent', () => {
  let component: CommonDataGridWithCheckBoxComponent;
  let fixture: ComponentFixture<CommonDataGridWithCheckBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonDataGridWithCheckBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonDataGridWithCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
