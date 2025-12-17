import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avocat2 } from './avocat2';

describe('Avocat2', () => {
  let component: Avocat2;
  let fixture: ComponentFixture<Avocat2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avocat2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avocat2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
