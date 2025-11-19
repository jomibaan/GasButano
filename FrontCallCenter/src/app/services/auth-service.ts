import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';



export interface FiltrosReporte {
  fechaTipo: string;   // 'createdAt', 'fecha_surtido', etc.
  fechaInicio: string; // '2025-11-01'
  fechaFin: string;    // '2025-11-10'
  estadoId?: any;   // El ID del estado (o null/undefined si no se filtra)
  rutaId?: any;     // El ID de la ruta (o null/undefined)
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
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
  async loginGoogle(access_token: string) {
    return await axios.get(this.apiUrl + '/auth/google/callback?access_token=' + access_token)
  }

  async forgot(email: string) {
    return await axios.post(`${this.apiUrl}/auth/forgot-password`, {
      email
    })
  }

  async reset(code: string, password: string, passwordConfirmation: string) {
    return await axios.post(`${this.apiUrl}/auth/reset-password`, {
      code,
      password,
      passwordConfirmation
    })
  }

  //#endregion
  //#region Cliente
  async createClinte(data: any) {
    console.log(data);
    const cliente = await axios.post(this.apiUrl + '/clientes', {
      data:
        { nombres: data.data.nombres, apellidos: data.data.apellidos, telefono: data.data.telefono }
    }, {
      headers: this.getAuthHeaders()
    })

    this.createDomicilio(data, cliente.data.data).then(() => {
      console.log('Domicilio creado: ')
      // console.log('Domicilio creado')
    }).catch((error) => {
      console.log(error)
    })
    return cliente;
  }

  async createDomicilio(data: any, cliente: any) {
    console.log('Cliente: ', cliente.data)
    return axios.post(this.apiUrl + '/domicilios', {
      data: {
        calle: data.data.calle,
        colonia: data.data.colonia,
        numero: data.data.numero,
        cp: data.data.cp,
        referencia: data.data.referencia,
        cliente: cliente.documentId
      }
    }, {
      headers: this.getAuthHeaders()
    })
  }

  async getClientes() {
    // const token = localStorage.getItem('token')
    return await axios.get(this.apiUrl + '/clientes', {
      headers: this.getAuthHeaders()
    });

  }
  async getClienteById(id: number) {
    return await axios.get(this.apiUrl + '/clientes/' + id, {
      headers: this.getAuthHeaders()
    });
  }
  async getClienteByPhone(telefono: string) {
    return await axios.get(this.apiUrl + '/clientes/telefono/' + telefono, {
      headers: this.getAuthHeaders()
    });
  }

  async updateCliente(id: number, data: any) {
    return await axios.put(this.apiUrl + '/clientes/' + id, { data: { nombres: data.nombres, apellidos: data.apellidos, telefono: data.telefono } }, {
      headers: this.getAuthHeaders()
    })

  }
  async deleteCliente(id: number) {
    return await axios.delete(this.apiUrl + '/clientes/' + id, {
      headers: this.getAuthHeaders()
    })
  }


  //#endregion
  //#region Tipo Servicio
  async getTipoServicios() {
    return await axios.get(this.apiUrl + '/tipo-servicios', {
      headers: this.getAuthHeaders()
    });
  }
  //#endregion



  //#region Estado Servicio
  async getEstadoServicios() {
    return await axios.get(this.apiUrl + '/estado-servicios', {
      headers: this.getAuthHeaders()
    });
  }
  //#endregion





  //#region Servicio
  // async getServicios() {
  //   return await axios.get(this.apiUrl + '/servicios', {
  //     headers: this.getAuthHeaders()
  //   });
  // }

  // async getServicios(filtros?: FiltrosReporte) {

  //   const params: any = {
  //     populate: {
  //       cliente: true,
  //       domicilio: true,
  //       ruta: true,
  //       tipo_servicio: true,
  //       estado_servicio: true
  //     },

  //     filters: {},

  //     sort: { createdAt: 'DESC' }
  //   };


  //   if (filtros) {
  //     console.log('Aplicando filtros:', filtros);

  //     if (filtros.fechaTipo && filtros.fechaInicio && filtros.fechaFin) {

  //       const inicio = new Date(filtros.fechaInicio);
  //       inicio.setHours(0, 0, 0, 0); // 00:00:00

  //       const fin = new Date(filtros.fechaFin);
  //       fin.setHours(23, 59, 59, 999); // 23:59:59

  //       params.filters[filtros.fechaTipo] = {
  //         $gte: inicio.toISOString(),
  //         $lte: fin.toISOString()
  //       };
  //     }

  //     // B. Filtro de Estado
  //     if (filtros.estadoId) {
  //       params.filters.estado_servicio = {
  //         id: { $eq: filtros.estadoId }
  //       };
  //     }

  //     // C. Filtro de Ruta
  //     if (filtros.rutaId) {
  //       params.filters.ruta = {
  //         id: { $eq: filtros.rutaId }
  //       };
  //     }
  //   }
  //   return await axios.get(this.apiUrl + '/servicios', {
  //     headers: this.getAuthHeaders(),
  //     params: params
  //   });
  // }

  async getServicios(filtros?: FiltrosReporte) {

    const params: any = {
      populate: {
        cliente: true,
        domicilio: true,
        ruta: true,
        tipo_servicio: true,
        estado_servicio: true
      },
      filters: {},
      sort: { createdAt: 'DESC' }
    };

    if (filtros) {
      console.log('Aplicando filtros:', filtros);

      if (filtros.fechaTipo && filtros.fechaInicio && filtros.fechaFin) {
        const inicio = new Date(filtros.fechaInicio);
        inicio.setHours(0, 0, 0, 0);
        const fin = new Date(filtros.fechaFin);
        fin.setHours(23, 59, 59, 999);
        params.filters[filtros.fechaTipo] = {
          $gte: inicio.toISOString(),
          $lte: fin.toISOString()
        };
      }
      if (filtros.estadoId) {
        params.filters.estado_servicio = {
          documentId: { $eq: filtros.estadoId }
        };
      }

      if (filtros.rutaId) {
        params.filters.ruta = {
          documentId: { $eq: filtros.rutaId }
        };
      }
    }

    // La llamada a Axios sigue igual
    return await axios.get(this.apiUrl + '/servicios', {
      headers: this.getAuthHeaders(),
      params: params
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

  async postServicio(data: any) {
    return await axios.post(this.apiUrl + '/servicios', {
      data:
      {
        domicilio: data.data.domicilio,
        cliente: data.data.clienteServicio,
        estado_servicio: data.data.estado,
        tipo_servicio: data.data.tipo,
        nota: data.data.nota,
        observacion: data.data.observacion,
        // monto: data.data.monto
      }
    }, {
      headers: this.getAuthHeaders()
    })
  }

  //   async updateCliente(id: number, data: any) {
  //   return await axios.put(this.apiUrl + '/clientes/' + id, { data: { nombres: data.nombres, apellidos: data.apellidos, telefono: data.telefono } }, {
  //     headers: this.getAuthHeaders()
  //   })

  // }
  async asignarRuta(id: number, data: any) {
    return await axios.put(this.apiUrl + '/servicios/' + id, {
      data: {
        ruta: data.ruta,
        estado_servicio: data.estado_servicio
      }
    }, {
      headers: this.getAuthHeaders()
    })
  }

  async programarServicio(id: number, data: any) {
    return await axios.put(this.apiUrl + '/servicios/' + id, {
      data: {
        ruta: data.ruta,
        estado_servicio: data.estado_servicio,
        fecha_programado: data.fecha_programado
      }
    }, {
      headers: this.getAuthHeaders()
    })
  }


  async cancelarServicio(id: number, data: any) {
    return await axios.put(this.apiUrl + '/servicios/' + id, {
      data: {
        estado_servicio: data.estado_servicio,
        fecha_cancelado: data.fecha_cancelado
      }
    }, {
      headers: this.getAuthHeaders()
    })
  }


  //#endregion


  //#region RUTA
  async getRutas() {
    return await axios.get(this.apiUrl + '/rutas', {
      headers: this.getAuthHeaders()
    });
  }


  //#endregion

}
