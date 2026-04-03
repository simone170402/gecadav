import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvocatBafoussam } from './avocat-bafoussam';

describe('AvocatBafoussam', () => {
  let component: AvocatBafoussam;
  let fixture: ComponentFixture<AvocatBafoussam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvocatBafoussam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvocatBafoussam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
