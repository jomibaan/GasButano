import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'; // Importar el Router

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.page.html',
  styleUrls: ['./unauthorized.page.scss'],
  standalone: false
})
export class UnauthorizedPage implements OnInit, OnDestroy {

  // --- PROPIEDADES AÑADIDAS ---
  countdown: number = 10;
  timerMessage: string = 'Por curioso serás hackeado';
  private intervalId: any;
  // -----------------------------

  constructor(private router: Router) { } // Inyectar el Router

  ngOnInit() {
    this.startCountdown(); // Iniciar la cuenta regresiva al cargar
  }

  ngOnDestroy() {
    // Limpiar el intervalo cuando el componente se destruye
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Inicia la cuenta regresiva de 20 a 0.
   */
  startCountdown() {
    this.intervalId = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(this.intervalId);
        // Mensaje de broma final
        this.timerMessage = '¡Tiempo agotado! Redirigiendo...';

        // Espera 3 segundos para mostrar el mensaje final antes de la redirección
        setTimeout(() => {
          this.goToLogin();
        }, 3000);
      }
    }, 1000);
  }

  /**
   * Navega a la página de login y limpia el contador.
   */
  goToLogin() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.router.navigateByUrl('/login');
  }
}
