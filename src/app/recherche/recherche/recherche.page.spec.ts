import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecherchePage } from './recherche.page';

describe('RecherchePage', () => {
  let component: RecherchePage;
  let fixture: ComponentFixture<RecherchePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecherchePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
