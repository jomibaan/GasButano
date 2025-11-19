import { Component, OnInit } from '@angular/core';
// import { ApiService } from '/services/api-service';
import { Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service';

@Component({
  selector: 'app-programados',
  templateUrl: './programados.page.html',
  styleUrls: ['./programados.page.scss'],
  standalone: false
})
export class ProgramadosPage implements OnInit {


  user: any = null;



  servicioProgramado: any[] = [];

  servicioSeleccionado: any = null;


  monto = '';
  eProgramado = '';
  eSurtido = '';
  fecha_surtido = new Date().toISOString();


  isModalServicioOpen = false;


  constructor(
    private api: ApiService,
    private router: Router,
    private alert: AlertController
  ) { }


  setOpenServicio(open: boolean, servicio?: any) {
    this.isModalServicioOpen = open;
    this.servicioSeleccionado = open ? servicio : null;
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    // this.isModalClienteOpen = false;
    this.isModalServicioOpen = false;
  }


  ngOnInit() {
    this.getMe();
    this.getServiciosProgramados();
    this.Programado();
    this.Surtido();
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


  async Programado() {
    try {
      const res = await this.api.getEstadoServicios();
      const todosLosEstados = res.data.data;
      const Programado = todosLosEstados.find((e: { tipo: string, documentId: string }) => e.tipo === "Programado");
      if (Programado) {
        this.eProgramado = Programado.documentId;
      } else {
        console.error("Error: No se encontró un estado con el tipo 'Cancelado'");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getServiciosProgramados() {
    try {
      const res = await this.api.getServiciosProgramados();
      const data = res.data.data;
      this.servicioProgramado = data.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      })

      console.log("Servicios Programado: ", this.servicioProgramado);
    } catch (error) {
      console.log(error);
    }
  }


  async Surtido() {
    try {
      const res = await this.api.getEstadoServicios();
      const todosLosEstados = res.data.data;
      const Surtido = todosLosEstados.find((e: { tipo: string, documentId: string }) => e.tipo === "Surtido");
      if (Surtido) {
        this.eSurtido = Surtido.documentId;
      } else {
        console.error("Error: No se encontró un estado con el tipo 'Cancelado'");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async surtir() {
    try {
      this.servicioSeleccionado.estado_servicio = this.eSurtido;
      const data = {
        monto: this.monto,
        fecha_surtido: this.fecha_surtido,
        estado_servicio: this.eSurtido
      }
      const res = await this.api.surtirServicio(this.servicioSeleccionado.documentId, data);
      console.log('Surtido: ', res.data)
      this.presentAlert('Exito', '', 'Surtido con éxito')
      this.getServiciosProgramados();
    } catch (error) {
      console.log(error);
    } finally {
      this.isModalServicioOpen = false;
    }
  }

  async navegarAGoogleMaps(servicio: any, event: Event) {
    event.stopPropagation();

    const dom = servicio.domicilio;

    if (!dom) {
      console.error('No hay domicilio para este servicio');
      // Opcional: Mostrar una alerta al repartidor
      // await this.presentAlert('Error', 'No hay Domicilio', 'Este servicio no tiene una dirección asignada.');
      return;
    }

    // 2. Construir la cadena de dirección COMPLETA.
    // ¡ES MUY IMPORTANTE añadir la ciudad, estado y país para que Maps sea preciso!
    const calle = dom.calle || '';
    const numero = dom.numero || '';
    const colonia = dom.colonia || '';

    // !!! CAMBIA ESTO por tu ciudad y estado !!!
    const ciudad = 'Zacatecas';
    const estado = 'Zacatecas';
    const pais = 'México';

    const direccionCompleta = `${calle} ${numero}, ${colonia}, ${ciudad}, ${estado}, ${pais}`;

    // 3. Codificar la dirección para que sea segura en una URL
    const query = encodeURIComponent(direccionCompleta);

    // 4. Crear la URL universal de Google Maps
    // (Esta URL abre el sitio web en desktop y la app en móvil si está instalada)
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;

    // 5. Abrir en una nueva pestaña del navegador
    window.open(url, '_blank');
  }





}
