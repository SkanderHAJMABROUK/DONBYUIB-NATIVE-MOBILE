import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualitesListPage } from './actualites-list.page';

describe('ActualitesListPage', () => {
  let component: ActualitesListPage;
  let fixture: ComponentFixture<ActualitesListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualitesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
