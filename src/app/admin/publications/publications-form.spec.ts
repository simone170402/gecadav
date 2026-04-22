import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationsForm } from './publications-form';

describe('PublicationsForm', () => {
  let component: PublicationsForm;
  let fixture: ComponentFixture<PublicationsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicationsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicationsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
