import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollecteDetailsPage } from './collecte-details.page';

describe('CollecteDetailsPage', () => {
  let component: CollecteDetailsPage;
  let fixture: ComponentFixture<CollecteDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CollecteDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
