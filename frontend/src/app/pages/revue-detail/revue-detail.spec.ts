import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevueDetail } from './revue-detail';

describe('RevueDetail', () => {
  let component: RevueDetail;
  let fixture: ComponentFixture<RevueDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevueDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevueDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
