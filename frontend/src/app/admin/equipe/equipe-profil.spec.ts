import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipeProfil } from './equipe-profil';

describe('EquipeProfil', () => {
  let component: EquipeProfil;
  let fixture: ComponentFixture<EquipeProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipeProfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipeProfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
