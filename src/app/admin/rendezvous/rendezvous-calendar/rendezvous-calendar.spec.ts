import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezvousCalendar } from './rendezvous-calendar';

describe('RendezvousCalendar', () => {
  let component: RendezvousCalendar;
  let fixture: ComponentFixture<RendezvousCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendezvousCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendezvousCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
