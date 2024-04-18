import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssociationsListPage } from './associations-list.page';

describe('AssociationsListPage', () => {
  let component: AssociationsListPage;
  let fixture: ComponentFixture<AssociationsListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
