import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaCorralComponent } from './carga-corral.component';

describe('CargaCorralComponent', () => {
  let component: CargaCorralComponent;
  let fixture: ComponentFixture<CargaCorralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaCorralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaCorralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
