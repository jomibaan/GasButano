import { CanActivateFn } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';


export const authGuard: CanActivateFn = async (route, state) => {

  let apiUrl = environment.apiUrl

  const token = localStorage.getItem('token');
  if (!token) {
    window.alert('Access Denied, Login is Required to Access This Page!');
    window.location.href = '/login';
    return false;
  } else {
    try {
      const user = await axios.get(apiUrl + '/users/me?populate=*', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      if (user.data.role.type == 'operador') {
        window.location.href = '/unauthorized';
        window.alert('Tu Rol no es el Adecuado, Inicia Sesión de Nuevo!');
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return false;
      }
      console.log('Este es el usuario: ', user.data);
      return true;
    } catch (error) {
      console.log(error);
      window.location.href = '/unauthorized';
      window.alert('Tu sesión a Caducado, Inicia Sesión de Nuevo!');
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return false;
    }
  }
  return false;
};
