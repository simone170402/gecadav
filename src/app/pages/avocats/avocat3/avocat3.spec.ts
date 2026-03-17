import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avocat3 } from './avocat3';

describe('Avocat3', () => {
  let component: Avocat3;
  let fixture: ComponentFixture<Avocat3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avocat3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avocat3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
