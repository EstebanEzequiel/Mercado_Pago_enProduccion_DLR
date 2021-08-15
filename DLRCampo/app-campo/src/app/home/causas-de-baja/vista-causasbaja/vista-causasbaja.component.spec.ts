import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaCausasbajaComponent } from './vista-causasbaja.component';

describe('VistaCausasbajaComponent', () => {
  let component: VistaCausasbajaComponent;
  let fixture: ComponentFixture<VistaCausasbajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaCausasbajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaCausasbajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
