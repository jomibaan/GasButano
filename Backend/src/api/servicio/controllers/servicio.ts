/**
 * servicio controller
 */

import { factories } from '@strapi/strapi'
import tipoServicio from '../../tipo-servicio/controllers/tipo-servicio';


export default factories.createCoreController('api::servicio.servicio', {
  async getServiciosByRuta(ctx) {

  },

  async delete(ctx) {
    const user = ctx.state.user;
    const documentId = ctx.params.id;
    console.log("Datos del Usuario: ", user);

    if (user.role.type === 'operador') {
      const servicio = await strapi.documents('api::servicio.servicio').findOne({
        documentId: documentId,
        filters: {
          ruta: {
            personal: {
              usuario: {
                id: {
                  $eq: user.id
                }
              }
            }
          }
        }
      })
      console.log("Service to Delete ", servicio)
      if (!servicio) {
        return ctx.unauthorized('Tu no puedes borrar este, no te pertenece')
      }
    }
    const result = await super.delete(ctx);
    return result;
  },

  async update(ctx) {
    const user = ctx.state.user;
    const documentId = ctx.params.id;
    console.log("Datos del Usuario: ", user);

    if (user.role.type === 'operador') {
      // Traer el servicio que esta almacenado en la base de datos
      const servicio = await strapi.documents('api::servicio.servicio').findOne({
        documentId: documentId,
        filters: {
          ruta: {
            personal: {
              usuario: {
                id: {
                  $eq: user.id
                }
              }
            }
          }
        }
      })

      console.log("Service to Update: ", servicio)
      // Si el servicio no pertenece al usuario: Retornar error
      if (!servicio) {
        return ctx.unauthorized('Tu no puedes editar este, no te pertenece')
      }

      ctx.request.body.data = {
        estado_servicio: ctx.request.body.data.estado_servicio,
        monto: ctx.request.body.data.monto,
        fecha_surtido: ctx.request.body.data.fecha_surtido
      };
    }

    const result = await super.update(ctx);
    return result;
  },

  async find(ctx) {
    console.log("Datos del Usuario: ", ctx.state.user);
    const user = ctx.state.user;

    if (user.role.type === 'operador') {
      ctx.query = {
        // ...ctx.query, 
        populate: {
          domicilio: true,
          tipo_servicio: true,
          estado_servicio: true,
          // ruta: {
          //     populate: {
          //         personal: {
          //             populate: {
          //                 usuario: true
          //             }
          //         }
          //     }
          // }
        },
        filters: {
          ruta: {
            personal: {
              usuario: {
                id: {
                  $eq: user.id
                }
              }
            }
          }
        }
      }
    } else {
      ctx.query = {
        ...ctx.query,
        // populate: {
        //   domicilio: true,
        //   cliente: true,
        //   ruta: true,
        //   tipo_servicio: true,
        //   estado_servicio: true
        // }
      }
    }


    //Modificar la consulta para filtrar por el usuario
    const result = await super.find(ctx); //Obtiene los datos de la consulta
    return result; //Regresa los datos
  },
  async findRegistrados(ctx) {
    console.log("Datos del Usuario: ", ctx.state.user);
    const user = ctx.state.user;
    ctx.query = {
      filters: {
        estado_servicio: {
          $eq: 'Registrado'
        }
      }
    }
    const result = await super.find(ctx); //Obtiene los datos de la consulta
    return result; //Regresa los datos

  },

  async getServicioByFecha(ctx) {
    console.log("Datos del Usuario: ", ctx.state.user);
    const user = ctx.state.user;

    const date = new Date().toLocaleString('en-US', {
      timeZone: 'America/Mexico_City'
    });
    const fechaMexico = new Date(date);

    fechaMexico.setHours(0, 0, 0, 0);

    const fechaInicioISO = fechaMexico.toISOString();


    const nextDateMexico = new Date(fechaMexico);
    nextDateMexico.setDate(nextDateMexico.getDate() + 1);
    const fechaFinISO = nextDateMexico.toISOString();


    if (user.role.type === 'operador') {
      ctx.query = {
        populate: {
          domicilio: true,
          tipo_servicio: true,
          estado_servicio: true,
        },
        filters: {
          ruta: {
            personal: {
              usuario: {
                id: {
                  $eq: user.id
                }
              }
            }
          },
          createdAt: {
            $gte: fechaInicioISO,
            $lt: fechaFinISO
          }
        }
      }
    } else {
      ctx.query = {
        populate: {
          domicilio: true,
          cliente: true,
          ruta: true,
          tipo_servicio: true,
          estado_servicio: true
        },
        filters: {
          createdAt: {
            $gte: fechaInicioISO,
            $lt: fechaFinISO
          },
          estado_servicio: {
            tipo: {
              $eq: ctx.params.estado
            }
          }
        }
      }

    }

    const result = await super.find(ctx); //Obtiene los datos de la consulta
    return result; //Regresa los datos
  },

  async getServicioProgramado(ctx) {


    console.log("Datos del Usuario: ", ctx.state.user);
    const user = ctx.state.user;


    const date = new Date().toLocaleString('en-US', {
      timeZone: 'America/Mexico_City'
    });
    const fechaMexico = new Date(date);

    fechaMexico.setHours(0, 0, 0, 0);
    const fechaInicioISO = fechaMexico.toISOString();



    if (user.role.type === 'operador') {
      ctx.query = {
        populate: {
          domicilio: true,
          tipo_servicio: true,
          estado_servicio: true,
        },
        filters: {
          ruta: {
            personal: {
              usuario: {
                id: {
                  $eq: user.id
                }
              }
            }
          },
          fecha_programado: {
            $gte: fechaInicioISO,
            $notNull: true
          },
          estado_servicio: {
            tipo: {
              $eq: "Programado"
            }
          }

        }
      }

    } else {
      ctx.query = {
        populate: {
          domicilio: true,
          cliente: true,
          ruta: true,
          tipo_servicio: true,
          estado_servicio: true
        },
        filters: {
          fecha_programado: {
            $gte: fechaInicioISO,
            $notNull: true
          },
          estado_servicio: {
            tipo: {
              $eq: "Programado"
            }
          }
        }
      }

    }

    const result = await super.find(ctx); //Obtiene los datos de la consulta
    return result; //Regresa los datos
  },
});
