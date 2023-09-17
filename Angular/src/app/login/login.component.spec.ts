import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoignComponent } from './login.component';

describe('LoignComponent', () => {
  let component: LoignComponent;
  let fixture: ComponentFixture<LoignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoignComponent]
    });
    fixture = TestBed.createComponent(LoignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
