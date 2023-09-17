import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RibbonBarComponent } from './ribbon-bar.component';

describe('RibbonBarComponent', () => {
  let component: RibbonBarComponent;
  let fixture: ComponentFixture<RibbonBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RibbonBarComponent]
    });
    fixture = TestBed.createComponent(RibbonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
