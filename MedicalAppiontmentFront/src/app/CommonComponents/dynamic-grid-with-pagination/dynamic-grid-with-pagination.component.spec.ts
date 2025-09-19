import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGridWithPaginationComponent } from './dynamic-grid-with-pagination.component';

describe('DynamicGridWithPaginationComponent', () => {
  let component: DynamicGridWithPaginationComponent;
  let fixture: ComponentFixture<DynamicGridWithPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicGridWithPaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicGridWithPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
