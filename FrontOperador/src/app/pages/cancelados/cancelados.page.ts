import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service';

@Component({
  selector: 'app-cancelados',
  templateUrl: './cancelados.page.html',
  styleUrls: ['./cancelados.page.scss'],
  standalone: false
})
export class CanceladosPage implements OnInit {


  user: any = null;

  servicioCancelado: any[] = [];

  eCancelado = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private alert: AlertController
  ) { }

  ngOnInit() {
    this.getMe();
    this.getServicioCancelado();

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


  async getServicioCancelado() {
    try {
      const res = await this.api.getServiciosByFecha("Cancelado");
      const data = res.data.data;
      const Cancelados = data.filter((s: any) =>
        s.estado_servicio && s.estado_servicio.tipo === 'Cancelado'
      );
      this.servicioCancelado = Cancelados.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      console.log("Servicios Cancelados: ", this.servicioCancelado)

    } catch (error) {
      console.error('Error al obtener servicios Cancelados:', error);
    }
  }

  async Surtido() {
    try {
      const res = await this.api.getEstadoServicios();
      const todosLosEstados = res.data.data;
      const Cancelado = todosLosEstados.find((e: { tipo: string, documentId: string }) => e.tipo === "Cancelado");
      if (Cancelado) {
        this.eCancelado = Cancelado.documentId;
      } else {
        console.error("Error: No se encontró un estado con el tipo 'Cancelado'");
      }
    } catch (error) {
      console.log(error);
    }
  }


}
