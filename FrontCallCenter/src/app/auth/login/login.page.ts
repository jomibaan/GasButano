import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  access_token: string = '';
  constructor
    (
      private api: AuthService,
      private alert: AlertController,
      private act: ActivatedRoute,
      private router: Router
    ) {
    this.access_token = this.act.snapshot.queryParams['access_token'];
    // console.log("Parametros: ", this.act.snapshot.queryParams)
    // console.log(this.access_token)

  }

  identifier: string = "callcenter";
  password: string = "87654321";

  ngOnInit() {
    // console.log("Cargando....")
    if (this.access_token) {
      this.loginGoogle();
    }
  }

  async loginGoogle() {
    try {
      const res = await this.api.loginGoogle(this.access_token);
      console.log(res.data);
      this.saveToken(res);
    } catch (error: any) {
      console.log(error);
    }
  }

  async login() {
    try {
      const res = await this.api.login(this.identifier, this.password);
      console.log(res.data);
      this.saveToken(res);
    } catch (error: any) {
      if (error.code == 'ERR_BAD_REQUEST') {
        this.presentAlert('Error', 'Credenciales Invalidas', 'Verifica tu informacion')
      }
      if (error.code == 'ERR_NETWORK') {
        this.presentAlert('Error', 'No se puede conectar al servidor', 'Intentalo mas tarde')
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

  async saveToken(data: any) {
    try {
      localStorage.setItem('token', data.data.jwt)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      this.presentAlert('Exito', 'Sesion Iniciada Correctamente', 'Bienvenido '+data.data.user.username)
      setTimeout(()=>{
          this.router.navigate(['/dashboard'])
      },2000)
    }
    catch (error) {
      this.presentAlert('Error', 'No se pudo guardar los datos de sesion', 'Intentalo mas tarde')
    }

  }
}
