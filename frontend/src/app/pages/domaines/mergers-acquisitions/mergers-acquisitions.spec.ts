import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergersAcquisitions } from './mergers-acquisitions';

describe('MergersAcquisitions', () => {
  let component: MergersAcquisitions;
  let fixture: ComponentFixture<MergersAcquisitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergersAcquisitions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergersAcquisitions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
