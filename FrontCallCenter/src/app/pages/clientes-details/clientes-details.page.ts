import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-clientes-details',
  templateUrl: './clientes-details.page.html',
  styleUrls: ['./clientes-details.page.scss'],
  standalone: false
})
export class ClientesDetailsPage implements OnInit {

  cliente: any = null;
  clienteId: any;

  nombres = '';
  apellidos = '';
  telefono = '';


  calle = '';
  colonia = '';
  numero = ''
  cp = '';
  referencia = '';

  isEditing: boolean = false;

  clienteOriginal: any;


  constructor(
    private api: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertController
  ) {
    this.clienteId = this.route.snapshot.paramMap.get('id');
    // this.getClienteById(this.clienteId);
  }

  ngOnInit() {
    this.getClienteById(this.clienteId);
  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alert.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['Aceptar'],
      mode: 'ios'
    });

    await alert.present();
  }

  async getClienteById(id: any) {
    try {
      const res = await this.api.getClienteById(id);
      console.log('Cliente Seleccionado: ', res.data.data)
      this.cliente = res.data.data;

    } catch (error) {
      console.log(error)
    }
  }

  async agregarDomicilio() {
    try {
      const data = {
        data: {
          calle: this.calle,
          colonia: this.colonia,
          numero: this.numero,
          cp: this.cp,
          referencia: this.referencia
        }
      }
      const res = await this.api.createDomicilio(data, this.cliente);
      console.log(res)
      this.presentAlert('ÉXITO', '', 'Domicilio creado con éxito')
      this.calle = '';
      this.colonia = '';
      this.numero = ''
      this.cp = '';
      this.referencia = '';
      this.getClienteById(this.clienteId);
    } catch (error) {
      console.log(error)
    }
  }
  toggleEditMode() {
    if (this.isEditing) {
      this.cliente = this.getClienteById(this.clienteId);
      console.log('Modo edición cancelado. Valores restaurados.');
    } else {
      console.log('Entrando al modo edición.');
    }
    // Alternar el estado
    this.isEditing = !this.isEditing;
  }

  async saveChanges() {
    console.log('Guardando cambios:', this.cliente);

    try {
      const res = await this.api.updateCliente(this.clienteId, this.cliente);
      console.log('Cliente actualizado:', res.data.data);
      this.clienteOriginal = { ...this.cliente };
      this.presentAlert('ÉXITO', '', 'Cliente actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar:', error);
    } finally {
      this.isEditing = false;
    }
  }

}
