import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Affaires } from './affaires';

describe('Affaires', () => {
  let component: Affaires;
  let fixture: ComponentFixture<Affaires>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Affaires]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Affaires);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
