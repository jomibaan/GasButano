import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanceladosPage } from './cancelados.page';

describe('CanceladosPage', () => {
  let component: CanceladosPage;
  let fixture: ComponentFixture<CanceladosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CanceladosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
