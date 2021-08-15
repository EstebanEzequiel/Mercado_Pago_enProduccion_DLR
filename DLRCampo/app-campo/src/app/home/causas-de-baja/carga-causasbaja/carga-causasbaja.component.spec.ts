import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaCausasbajaComponent } from './carga-causasbaja.component';

describe('CargaCausasbajaComponent', () => {
  let component: CargaCausasbajaComponent;
  let fixture: ComponentFixture<CargaCausasbajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaCausasbajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaCausasbajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
