import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaAnimalesComponent } from './carga-animales.component';

describe('CargaAnimalesComponent', () => {
  let component: CargaAnimalesComponent;
  let fixture: ComponentFixture<CargaAnimalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaAnimalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaAnimalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
