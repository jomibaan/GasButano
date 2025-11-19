import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService, FiltrosReporte } from 'src/app/services/auth-service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
  standalone: false
})
export class FiltersPage implements OnInit {

  rutas: any[] = [];
  estados_servicio: any[] = [];

  // --- Tus Variables de Filtro ---
  fechaTipo: string = 'createdAt';
  fechaInicio: string = '';
  fechaFin: string = '';
  estadoId: number | null = null; // Sigue iniciando en null
  rutaId: number | null = null;   // Sigue iniciando en null

  isLoading: boolean = false;
  resultadosReporte: any[] = [];

  constructor(
    private router: Router,
    private alert: AlertController,
    private api: AuthService
  ) { }

  ngOnInit() {
    this.getRutas();
    this.getEstadosServicio();
  }

  // (Tu presentAlert está bien, solo tenías un argumento extra al llamarlo)
  async presentAlert(header: string, subHeader: string, message: string) {
    // ... (Tu código de presentAlert)
  }

  async getRutas() {
    try {
      const res = await this.api.getRutas();
      this.rutas = res.data.data;

      // 💡 SOLUCIÓN PARTE 1 (Opcional):
      // Si quieres que "Todas las Rutas" sea la opción por defecto,
      // puedes dejar 'rutaId' como 'null' o añadir una opción "Todas" en el HTML.
      // Si quieres que la PRIMERA ruta sea la defecto, descomenta lo siguiente:
      // if (this.rutas.length > 0) {
      //   this.rutaId = this.rutas[0].id;
      // }

    } catch (error) {
      console.log(error);
    }
  }

  async getEstadosServicio() {
    try {
      const res = await this.api.getEstadoServicios();
      this.estados_servicio = res.data.data;

      // 💡 SOLUCIÓN PARTE 2 (Clave):
      // Si quieres que "Registrado" sea el filtro por defecto,
      // buscamos su ID y lo asignamos a 'estadoId'.
      if (this.estados_servicio.length > 0) {
        const estadoDefault = this.estados_servicio.find(e => e.tipo === 'Registrado');

        if (estadoDefault) {
          this.estadoId = estadoDefault.id; // ¡Asignamos el ID por defecto!
        } else {
          // Si no existe "Registrado", asigna el primero de la lista
          this.estadoId = this.estados_servicio[0].id;
        }
      }

    } catch (error) {
      console.log(error);
    }
  }


  async generarReporte() {

    // Validar que las fechas estén puestas
    if (!this.fechaInicio || !this.fechaFin) {
      this.presentAlert('Datos incompletos', 'Selecciona Fechas', 'Por favor, selecciona una fecha de inicio y una fecha de fin.');
      return;
    }

    this.isLoading = true;
    this.resultadosReporte = [];

    const filtros: FiltrosReporte = {
      fechaTipo: this.fechaTipo,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      estadoId: this.estadoId,
      rutaId: this.rutaId
    };

    try {

      const res = await this.api.getServicios(filtros);

      // C. Asignamos los resultados
      this.resultadosReporte = res.data.data;
      console.log('Reporte generado:', this.resultadosReporte);

      // D. Mostrar alerta si no se encontraron resultados
      if (this.resultadosReporte.length === 0) {
        this.presentAlert('Sin resultados', 'Búsqueda Vacía', 'No se encontraron servicios que coincidan con los filtros seleccionados.');
      }

    } catch (error: any) {
      console.error("Error al generar el reporte:", error);
      // 💡 CORRECCIÓN (Llamada a presentAlert con 3 args)
      this.presentAlert('Error de Red', 'Conexión Fallida', 'No se pudo conectar con el servidor.');
    } finally {
      this.isLoading = false;
    }
  }
}
