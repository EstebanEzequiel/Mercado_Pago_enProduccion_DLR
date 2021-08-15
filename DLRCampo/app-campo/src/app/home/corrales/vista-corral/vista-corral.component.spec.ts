import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaCorralComponent } from './vista-corral.component';

describe('VistaCorralComponent', () => {
  let component: VistaCorralComponent;
  let fixture: ComponentFixture<VistaCorralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaCorralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaCorralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
