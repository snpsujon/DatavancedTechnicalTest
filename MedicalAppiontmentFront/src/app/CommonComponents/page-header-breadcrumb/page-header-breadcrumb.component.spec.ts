import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderBreadcrumbComponent } from './page-header-breadcrumb.component';

describe('PageHeaderBreadcrumbComponent', () => {
  let component: PageHeaderBreadcrumbComponent;
  let fixture: ComponentFixture<PageHeaderBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderBreadcrumbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageHeaderBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
