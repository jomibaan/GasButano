import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesDetailsPage } from './clientes-details.page';

describe('ClientesDetailsPage', () => {
  let component: ClientesDetailsPage;
  let fixture: ComponentFixture<ClientesDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
