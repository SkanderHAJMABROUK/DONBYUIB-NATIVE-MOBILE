import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectesListPage } from './collectes-list.page';

describe('CollectesListPage', () => {
  let component: CollectesListPage;
  let fixture: ComponentFixture<CollectesListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
