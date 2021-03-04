import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListAltUIComponent } from './products-list-alt-ui.component';

describe('ProductsListAltUIComponent', () => {
  let component: ProductsListAltUIComponent;
  let fixture: ComponentFixture<ProductsListAltUIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsListAltUIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListAltUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
