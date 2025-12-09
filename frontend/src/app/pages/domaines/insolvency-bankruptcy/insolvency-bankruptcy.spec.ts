import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsolvencyBankruptcy } from './insolvency-bankruptcy';

describe('InsolvencyBankruptcy', () => {
  let component: InsolvencyBankruptcy;
  let fixture: ComponentFixture<InsolvencyBankruptcy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsolvencyBankruptcy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsolvencyBankruptcy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
