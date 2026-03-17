import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avocat4 } from './avocat4';

describe('Avocat4', () => {
  let component: Avocat4;
  let fixture: ComponentFixture<Avocat4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avocat4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avocat4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
