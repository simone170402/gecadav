import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Procurations } from './procurations';

describe('Procurations', () => {
  let component: Procurations;
  let fixture: ComponentFixture<Procurations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Procurations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Procurations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
