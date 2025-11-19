import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service';

@Component({
  selector: 'app-surtidos',
  templateUrl: './surtidos.page.html',
  styleUrls: ['./surtidos.page.scss'],
  standalone: false

})
export class SurtidosPage implements OnInit {


  user: any = null;
  servicioSurtido: any[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private alert: AlertController
  ) { }

  ngOnInit() {
    this.getMe();
    this.getServicioSurtidos();

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

  async getMe() {
    try {
      const res = await this.api.getMe();
      console.log(res.data);
      this.user = res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login'])
  }


  async getServicioSurtidos() {
    try {
      const res = await this.api.getServiciosByFecha("Surtido");
      const data = res.data.data;
      const Surtidos = data.filter((s: any) =>
        s.estado_servicio && s.estado_servicio.tipo === 'Surtido'
      );
      this.servicioSurtido = Surtidos.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      console.log("Servicios Surtidos: ", this.servicioSurtido)

    } catch (error) {
      console.error('Error al obtener servicios Surtidos:', error);
    }
  }

}
