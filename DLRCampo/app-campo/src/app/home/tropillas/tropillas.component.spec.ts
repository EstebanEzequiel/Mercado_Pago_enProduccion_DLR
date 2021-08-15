import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TropillasComponent } from './tropillas.component';

describe('TropillasComponent', () => {
  let component: TropillasComponent;
  let fixture: ComponentFixture<TropillasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TropillasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TropillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
