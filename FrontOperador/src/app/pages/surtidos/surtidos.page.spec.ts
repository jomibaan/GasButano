import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurtidosPage } from './surtidos.page';

describe('SurtidosPage', () => {
  let component: SurtidosPage;
  let fixture: ComponentFixture<SurtidosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SurtidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
