import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Revue } from './revue';

describe('Revue', () => {
  let component: Revue;
  let fixture: ComponentFixture<Revue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Revue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Revue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
