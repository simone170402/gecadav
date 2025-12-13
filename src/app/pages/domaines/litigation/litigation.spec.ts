import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Litigation } from './litigation';

describe('Litigation', () => {
  let component: Litigation;
  let fixture: ComponentFixture<Litigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Litigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Litigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
