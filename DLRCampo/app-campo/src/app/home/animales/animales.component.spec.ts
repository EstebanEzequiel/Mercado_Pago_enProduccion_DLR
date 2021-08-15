import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalesComponent } from './animales.component';

describe('AnimalesComponent', () => {
  let component: AnimalesComponent;
  let fixture: ComponentFixture<AnimalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
