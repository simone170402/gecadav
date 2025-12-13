import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentCompensation } from './employment-compensation';

describe('EmploymentCompensation', () => {
  let component: EmploymentCompensation;
  let fixture: ComponentFixture<EmploymentCompensation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploymentCompensation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmploymentCompensation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
