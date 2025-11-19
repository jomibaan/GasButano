import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-service';
import { OverlayEventDetail } from '@ionic/core/components';
// import { IonDatetime, IonDatetimeButton, IonModal } from '@ionic/angular/standalone';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.page.html',
  styleUrls: ['./servicio.page.scss'],
  // imports: [IonDatetime, IonDatetimeButton, IonModal],
  standalone: false
})
export class ServicioPage implements OnInit {

  isModalOpen = false;

  telefono = '';
  clienteSeleccionado: any = null;

  tipo_servicio: any[] = [];
  servicios: any[] = [];

  servicioAsignado: any[] = [];
  servicioCancelado: any[] = [];
  servicioRegistrado: any[] = [];
  servicioProgramado: any[] = [];
  servicioSurtido: any[] = [];
  servicioSeleccionado: any = null;


  domicilio = '';
  clienteServicio = '';
  estado = '';
  tipo = '';
  nota = '';
  observacion = '';
  // monto = '';

  Eregistrado = '';
  Easignado = '';
  Ecancelado = '';
  Eprogramado = '';
  Esurtido = '';


  ruta = '';


  nombres = '';
  apellidos = '';
  // telefonoCliente = '';
  calle = '';
  colonia = '';
  numero = ''
  cp = '';
  referencia = '';

  isModalServicioOpen = false;
  isModalProgramarOpen = false;

  segmentoActual: string = 'pendientes';

  fecha_cancelado = new Date().toISOString();
  fecha_programado: string = new Date().toISOString();



  rutas: any[] = [];


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    this.isModalOpen = false;
    // this.isModalClienteOpen = false;
    this.isModalServicioOpen = false;
    this.isModalProgramarOpen = false;
  }

  buscando: boolean = false;
  busquedaRealizada: boolean = false;
  constructor(
    private api: AuthService,
    private alert: AlertController
  ) { }

  ngOnInit() {
    this.getTipoServicio();
    this.getEstadoServicio();
    this.Registrado();
    this.Asignado();
    this.Cancelado();
    this.Programado();
    this.Surtido();

    // this.getServicio();
    this.getServicioAsignado();
    this.getServicioRegistrado();
    this.getServicioCancelado();
    this.getRutas();
    this.getServiciosProgramados();
    this.getServicioSurtido();

  }

  setOpenServicio(open: boolean, servicio?: any) {
    this.isModalServicioOpen = open;
    this.servicioSeleccionado = open ? servicio : null;
  }

  setOpenProgramar(open: boolean, servicio?: any) {
    this.isModalProgramarOpen = open;
    this.servicioSeleccionado = open ? servicio : null;
  }
  segmentChanged() {
    console.log('Cambiando a segmento:', this.segmentoActual);
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


  async generarPedido() {
    const data = {
      data: {
        domicilio: this.domicilio,
        clienteServicio: this.clienteSeleccionado.documentId,
        estado: this.Eregistrado,
        tipo: this.tipo,
        nota: this.nota,
        observacion: this.observacion,
        // monto: this.monto
      }
    }
    console.log("Datos a enviar: ", data)
    try {
      const res = await this.api.postServicio(data);
      console.log("Pedido exitoso: ", res.data);
      this.domicilio = '';
      this.clienteServicio = '';
      this.estado = '';
      this.tipo = '';
      this.nota = '';
      this.observacion = '';
      // this.monto = '';
      this.telefono = '';
      this.clienteSeleccionado = null;
      this.buscando = false;
      this.busquedaRealizada = false;
      // this.getServicio();
      this.getServicioAsignado();
      this.getServicioRegistrado();
      this.getServicioCancelado();
      this.getServicioSurtido();

      this.presentAlert('Éxito', `ID: ${res.data.data.id || 'N/A'}`, `El nuevo pedido ha sido registrado correctamente en el sistema.`)

    } catch (error: any) {
      console.log('Error al Crear un Servicio: ', error);
      if (error.code == 'ERR_BAD_REQUEST') {
        this.presentAlert('Error', 'Credenciales Invalidas', 'Verifica tu informacion')
        return;
      }
      if (error.code == 'ERR_NETWORK') {
        this.presentAlert('Error', 'No se puede conectar al servidor', 'Intentalo mas tarde')
        return;
      }
    }
  }

  async Registrado() {
    try {
      const res = await this.api.getEstadoServicios();
      const todosLosEstados = res.data.data;
      const estadoDefault = todosLosEstados.find((e: { tipo: string, documentId: string }) => e.tipo === "Registrado");
      if (estadoDefault) {
        this.Eregistrado = estadoDefault.documentId;
      } else {
        console.error("Error: No se encontró un estado con el tipo 'Registrado'");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async Asignado() {
    try {
      const res = await this.api.getEstadoServicios();
      const todosLosEstados = res.data.data;
      const Asignado = todosLosEstados.find((e: { tipo: string, documentId: string }) => e.tipo === "Asignado");
      if (Asignado) {
        this.Easignado = Asignado.documentId;
      } else {
        console.error("Error: No se encontró un estado con el tipo 'Asignado'");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async Cancelado() {
    try {
      const res = await this.api.getEstadoServicios();
      const todosLosEstados = res.data.data;
      const Cancelado = todosLosEstados.find((e: { tipo: string, documentId: string }) => e.tipo === "Cancelado");
      if (Cancelado) {
        this.Ecancelado = Cancelado.documentId;
      } else {
        console.error("Error: No se encontró un estado con el tipo 'Cancelado'");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async Programado() {
    try {
      const res = await this.api.getEstadoServicios();
      const todosLosEstados = res.data.data;
      const Programado = todosLosEstados.find((e: { tipo: string, documentId: string }) => e.tipo === "Programado");
      if (Programado) {
        this.Eprogramado = Programado.documentId;
      } else {
        console.error("Error: No se encontró un estado con el tipo 'Cancelado'");
      }
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
        this.Esurtido = Surtido.documentId;
      } else {
        console.error("Error: No se encontró un estado con el tipo 'Cancelado'");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getClienteByPhone(telefono: string) {
    if (!telefono) {
      return;
    }

    this.buscando = true;
    this.clienteSeleccionado = null;
    this.busquedaRealizada = false;

    try {
      const res = await this.api.getClienteByPhone(telefono);
      this.clienteSeleccionado = res.data;
      console.log('Cliente encontrado:', this.clienteSeleccionado);
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      this.clienteSeleccionado = null;
    } finally {
      this.buscando = false;
      this.busquedaRealizada = true;
      console.log('Teléfono buscado:', telefono);
    }
  }

  async getTipoServicio() {
    try {
      const res = await this.api.getTipoServicios();
      console.log("Tipos de Servicio: ", res.data.data);
      this.tipo_servicio = res.data.data;

    } catch (error) {
      console.log(error);
    }
  }

  async getEstadoServicio() {
    try {
      const res = await this.api.getEstadoServicios();
      console.log('Estados de Servicio: ', res.data.data);

    } catch (error) {
      console.log(error);
    }
  }

  async createCliente() {
    try {
      const data = {
        data: {
          nombres: this.nombres,
          apellidos: this.apellidos,
          telefono: this.telefono,
          calle: this.calle,
          colonia: this.colonia,
          numero: this.numero,
          cp: this.cp,
          referencia: this.referencia
        }
      }
      const res = await this.api.createClinte(data);

      this.presentAlert('Éxito', `ID: ${res.data.data.id || 'N/A'}`, `El nuevo cliente ${res.data.data.nombres} ha sido registrado correctamente en el sistema.`)

      console.log('Cliente creado:', res.data.data);

      const nuevoTelefono = this.telefono;
      this.nombres = '';
      this.apellidos = '';
      this.telefono = '';
      this.calle = '';
      this.colonia = '';
      this.numero = ''
      this.cp = '';
      this.referencia = '';

      await this.getClienteByPhone(nuevoTelefono);
      // this.domicilio = ;


    } catch (error: any) {
      console.error('Error al crear cliente:', error);
      if (error.response?.data?.error.message == 'This attribute must be unique') {
        this.presentAlert('Error', 'El telefono ya existe', 'Intentalo con otro')
        return;
      }
      if (error.code == 'ERR_BAD_REQUEST') {
        this.presentAlert('Error', 'Credenciales Invalidas', 'Verifica tu informacion')
        return;
      }
      if (error.code == 'ERR_NETWORK') {
        this.presentAlert('Error', 'No se puede conectar al servidor', 'Intentalo mas tarde')
        return;
      }

    }
  }

  // async getServicio() {
  //   try {
  //     const res = await this.api.getServiciosByFecha();
  //     const data = res.data.data;
  //     this.servicios = data.sort((a: any, b: any) => {
  //       const dateA = new Date(a.createdAt).getTime();
  //       const dateB = new Date(b.createdAt).getTime();
  //       return dateB - dateA;
  //     });
  //     console.log("Servicios: ", this.servicios);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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

  async getServicioAsignado() {
    try {
      const res = await this.api.getServiciosByFecha("Asignado");
      const Asignados = res.data.data;
      // const Asignados = data.filter((s: any) =>
      //   s.estado_servicio && s.estado_servicio.tipo === 'Asignado'
      // );
      this.servicioAsignado = Asignados;
      console.log("Servicios Asignados: ", this.servicioAsignado);
    } catch (error) {
      console.error('Error al obtener servicios asignados:', error);
    }
  }

  async getServicioRegistrado() {
    try {
      const res = await this.api.getServiciosByFecha("Registrado");
      const data = res.data.data;
      const Registrados = data.filter((s: any) =>
        s.estado_servicio && s.estado_servicio.tipo === 'Registrado'
      );
      this.servicioRegistrado = Registrados.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      console.log("Servicios Registrados: ", this.servicioRegistrado)

    } catch (error) {
      console.error('Error al obtener servicios asignados:', error);
    }
  }

  async getServicioCancelado() {
    try {
      const res = await this.api.getServiciosByFecha("Cancelado");
      const Cancelados = res.data.data;
      // const Cancelados = data.filter((s: any) =>
      //   s.estado_servicio && s.estado_servicio.tipo === 'Cancelado'
      // );
      this.servicioCancelado = Cancelados.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      console.log("Servicios Cancelados: ", this.servicioCancelado)

    } catch (error) {
      console.error('Error al obtener servicios asignados:', error);
    }
  }


  async getServicioSurtido() {
    try {
      const res = await this.api.getServiciosByFecha("Surtido");
      const Surtidos = res.data.data;
      // const Cancelados = data.filter((s: any) =>
      //   s.estado_servicio && s.estado_servicio.tipo === 'Surtido'
      // );
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


  async getRutas() {
    try {
      const res = await this.api.getRutas();
      console.log("Rutas: ", res.data.data);
      this.rutas = res.data.data;

    } catch (error) {
      console.log(error);
    }
  }

  async asignarRuta() {
    try {
      // this.servicioSeleccionado.estado_servicio = this.Easignado;
      const data = {
        ruta: this.ruta,
        estado_servicio: this.Easignado
      }

      const res = await this.api.asignarRuta(this.servicioSeleccionado.documentId, data);
      console.log('Ruta asignada: ', res.data)
      this.getServicioAsignado();
      this.getServicioRegistrado();
    } catch (error) {
      console.log('Error al asignar ruta', error)
    } finally {
      this.isModalServicioOpen = false;
    }
  }

  async programarServicio() {
    try {
      const data = {
        ruta: this.ruta,
        estado_servicio: this.Eprogramado,
        fecha_programado: this.fecha_programado
      }
      const res = await this.api.programarServicio(this.servicioSeleccionado.documentId, data);
      console.log('Servicio Programado: ', res.data)
      this.getServicioAsignado();
      this.getServicioRegistrado();
      this.getServiciosProgramados();
    } catch (error) {
      console.log('Error al programar servicio', error);
    } finally {
      this.isModalProgramarOpen = false;
    }
  }

  async confirmarCancelacion(servicio: any) {
    const alert = await this.alert.create({
      header: 'Confirmar Cancelación',
      message: `¿Estás seguro de que deseas cancelar el servicio para ${servicio.cliente?.nombres}? Esta acción no se puede deshacer.`,
      mode: 'ios',
      buttons: [
        {
          text: 'No, mantener',
          role: 'cancel',
        },
        {
          text: 'Sí, Cancelar',
          cssClass: 'alert-button-danger',
          handler: () => {
            this.cancelarServicio(servicio);
          },
        },
      ],
    });

    await alert.present();
  }

  async cancelarServicio(servicioACancelar: any) {
    try {
      const payload = {
        estado_servicio: this.Ecancelado,
        fecha_cancelado: this.fecha_cancelado

      };
      const res = await this.api.cancelarServicio(servicioACancelar.documentId, payload);

      console.log('Servicio Cancelado: ', res.data);

      this.getServicioCancelado();
      this.getServicioRegistrado();
      this.getServicioAsignado();

    } catch (error) {
      console.log('Error al cancelar servicio', error);
    }
  }
}
