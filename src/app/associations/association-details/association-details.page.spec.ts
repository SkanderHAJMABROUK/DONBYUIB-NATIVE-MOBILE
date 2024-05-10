import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssociationDetailsPage } from './association-details.page';

describe('AssociationDetailsPage', () => {
  let component: AssociationDetailsPage;
  let fixture: ComponentFixture<AssociationDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
