import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateFinance } from './corporate-finance';

describe('CorporateFinance', () => {
  let component: CorporateFinance;
  let fixture: ComponentFixture<CorporateFinance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporateFinance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorporateFinance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
