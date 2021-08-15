import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeContenidoComponent } from './home-contenido.component';

describe('HomeContenidoComponent', () => {
  let component: HomeContenidoComponent;
  let fixture: ComponentFixture<HomeContenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeContenidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
