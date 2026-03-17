import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avocat5 } from './avocat5';

describe('Avocat5', () => {
  let component: Avocat5;
  let fixture: ComponentFixture<Avocat5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avocat5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avocat5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
