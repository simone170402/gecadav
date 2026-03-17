import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avocat1 } from './avocat1';

describe('Avocat1', () => {
  let component: Avocat1;
  let fixture: ComponentFixture<Avocat1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avocat1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avocat1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
