import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CausasDeBajaComponent } from './causas-de-baja.component';

describe('CausasDeBajaComponent', () => {
  let component: CausasDeBajaComponent;
  let fixture: ComponentFixture<CausasDeBajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CausasDeBajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CausasDeBajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
