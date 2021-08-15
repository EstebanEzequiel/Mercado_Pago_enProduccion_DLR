import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaTropillaComponent } from './vista-tropilla.component';

describe('VistaTropillaComponent', () => {
  let component: VistaTropillaComponent;
  let fixture: ComponentFixture<VistaTropillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaTropillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaTropillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
