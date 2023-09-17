import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPassResetComponent } from './request-pass-reset.component';

describe('RequestPassResetComponent', () => {
  let component: RequestPassResetComponent;
  let fixture: ComponentFixture<RequestPassResetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestPassResetComponent]
    });
    fixture = TestBed.createComponent(RequestPassResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
