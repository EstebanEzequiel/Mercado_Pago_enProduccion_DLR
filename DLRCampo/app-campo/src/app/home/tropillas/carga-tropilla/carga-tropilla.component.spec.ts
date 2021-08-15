import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaTropillaComponent } from './carga-tropilla.component';

describe('CargaTropillaComponent', () => {
  let component: CargaTropillaComponent;
  let fixture: ComponentFixture<CargaTropillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaTropillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaTropillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
