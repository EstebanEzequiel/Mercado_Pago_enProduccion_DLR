import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistasComponent } from './vistas.component';

describe('VistasComponent', () => {
  let component: VistasComponent;
  let fixture: ComponentFixture<VistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
