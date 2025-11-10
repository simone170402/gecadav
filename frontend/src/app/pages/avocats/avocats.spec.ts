import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avocats } from './avocats';

describe('Avocats', () => {
  let component: Avocats;
  let fixture: ComponentFixture<Avocats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avocats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avocats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
