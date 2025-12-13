import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativeDisputeResolution } from './alternative-dispute-resolution';

describe('AlternativeDisputeResolution', () => {
  let component: AlternativeDisputeResolution;
  let fixture: ComponentFixture<AlternativeDisputeResolution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlternativeDisputeResolution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlternativeDisputeResolution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
