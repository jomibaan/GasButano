import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl

  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    return token ? { 'Authorization': 'Bearer ' + token } : {}
  }

  //#region Auth

  async login(identifier: string, password: string) {
    return await axios.post(this.apiUrl + '/auth/local', {
      identifier,
      password
    })
  }

  //#endregion

  //#region User
  async getMe() {
    return await axios.get(this.apiUrl + '/users/me?populate=*', {
      headers: this.getAuthHeaders()
    })
  }

  //#endregion

  //#region Servicios

  async getEstadoServicios() {
    return await axios.get(this.apiUrl + '/estado-servicios', {
      headers: this.getAuthHeaders()
    });
  }


  async getServiciosByFecha(estado: string) {
    return await axios.get(this.apiUrl + '/servicios-hoy/' + estado, {
      headers: this.getAuthHeaders()
    });
  }

  async getServiciosProgramados() {
    return await axios.get(this.apiUrl + '/servicios-programados', {
      headers: this.getAuthHeaders()
    });
  }

  //   async asignarRuta(id: number, data: any) {
  //   return await axios.put(this.apiUrl + '/servicios/' + id, {
  //     data: {
  //       ruta: data.ruta,
  //       estado_servicio: data.estado_servicio
  //     }
  //   }, {
  //     headers: this.getAuthHeaders()
  //   })
  // }


  async surtirServicio(id: number, data: any) {
    return await axios.put(this.apiUrl + '/servicios/' + id, {
      data: {
        estado_servicio: data.estado_servicio,
        fecha_surtido: data.fecha_surtido,
        monto: data.monto
      }
    }, {
      headers: this.getAuthHeaders()
    })
  }
  //#endregion

}
