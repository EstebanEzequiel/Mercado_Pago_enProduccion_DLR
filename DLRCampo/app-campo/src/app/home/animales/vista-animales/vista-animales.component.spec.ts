import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAnimalesComponent } from './vista-animales.component';

describe('VistaAnimalesComponent', () => {
  let component: VistaAnimalesComponent;
  let fixture: ComponentFixture<VistaAnimalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaAnimalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaAnimalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
