import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Immigration } from './immigration';

describe('Immigration', () => {
  let component: Immigration;
  let fixture: ComponentFixture<Immigration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Immigration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Immigration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
