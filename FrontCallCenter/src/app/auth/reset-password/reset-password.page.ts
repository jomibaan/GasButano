import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false
})
export class ResetPasswordPage implements OnInit {

  constructor(
    private api: AuthService,
    private alert: AlertController,
    private act: ActivatedRoute
  ) {
    this.code = this.act.snapshot.paramMap.get('code') as string;
  }
  code: string = "";
  password: string = "";
  passwordConfirmation: string = "";
  ngOnInit() {
  }


  async reset() {

    try {
      const res = await this.api.reset(this.code, this.password, this.passwordConfirmation);
      console.log(res);
      this.presentAlert('ÉXITO', '', 'Contraseña Reestablecida');
    } catch (error: any) {
      if (error.response?.data?.error.message == 'Incorrect code provided') {
        this.presentAlert('Érror', 'Codigo Invalido', 'Verifica el enlace que te enviamos por correo')
        return;
      }
      if (error.response?.data?.error.message == 'code is a required field') {
        this.presentAlert('Érror', 'Codigo Invalido', 'Verifica el enlace que te enviamos por correo')
        return;
      }
      if (error.code == 'ERR_BAD_REQUEST') {
        this.presentAlert('Error', 'Las contraseñas no coinciden', 'Por favor, asegúrate de que ambos campos sean iguales.');
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
