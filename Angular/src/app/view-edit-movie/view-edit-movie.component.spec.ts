import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditMovieComponent } from './view-edit-movie.component';

describe('ViewEditMovieComponent', () => {
  let component: ViewEditMovieComponent;
  let fixture: ComponentFixture<ViewEditMovieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEditMovieComponent]
    });
    fixture = TestBed.createComponent(ViewEditMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
