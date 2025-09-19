import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSelectBoxComponent } from './common-select-box.component';

describe('CommonSelectBoxComponent', () => {
  let component: CommonSelectBoxComponent;
  let fixture: ComponentFixture<CommonSelectBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonSelectBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonSelectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
