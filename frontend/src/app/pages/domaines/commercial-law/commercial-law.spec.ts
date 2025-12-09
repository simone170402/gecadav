import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialLaw } from './commercial-law';

describe('CommercialLaw', () => {
  let component: CommercialLaw;
  let fixture: ComponentFixture<CommercialLaw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommercialLaw]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommercialLaw);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
