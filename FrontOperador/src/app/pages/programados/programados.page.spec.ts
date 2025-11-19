import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramadosPage } from './programados.page';

describe('ProgramadosPage', () => {
  let component: ProgramadosPage;
  let fixture: ComponentFixture<ProgramadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
