import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDataGridComponent } from './common-data-grid.component';

describe('CommonDataGridComponent', () => {
  let component: CommonDataGridComponent;
  let fixture: ComponentFixture<CommonDataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonDataGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
