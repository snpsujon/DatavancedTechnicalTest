import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAutoCompleteApiComponent } from './common-auto-complete-api.component';

describe('CommonAutoCompleteApiComponent', () => {
  let component: CommonAutoCompleteApiComponent;
  let fixture: ComponentFixture<CommonAutoCompleteApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonAutoCompleteApiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonAutoCompleteApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
