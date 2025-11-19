import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
  standalone: false
})
export class ForgotPage implements OnInit {

  email: string = ""
  constructor
    (
      private api: AuthService,
      private alert:AlertController
    ) { }

  ngOnInit() {
  }

  async forgot() {
    try {
      const res = await this.api.forgot(this.email)
      console.log(res);
      this.presentAlert('ÉXITO','','Revisa tu correo para reestablecer tu contraseña')
    }
    catch (error: any) {
      if (error.code == 'ERR_BAD_REQUEST') {
        this.presentAlert('Error', 'Tu No pusiste un correo', 'Verifica tus campos')
        return
      }
      if (error.code == 'ERR_NETWORK') {
        this.presentAlert('Error', 'No se puede conectar al servidor', 'Intentalo mas tarde')
        return
      }
    }
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

}
