import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReleasesComponent } from './product-releases.component';

describe('ProductReleasesComponent', () => {
  let component: ProductReleasesComponent;
  let fixture: ComponentFixture<ProductReleasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReleasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductReleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
