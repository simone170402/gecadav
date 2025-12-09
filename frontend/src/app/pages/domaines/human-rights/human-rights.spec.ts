import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanRights } from './human-rights';

describe('HumanRights', () => {
  let component: HumanRights;
  let fixture: ComponentFixture<HumanRights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanRights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanRights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
