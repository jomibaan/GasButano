/**
 * ruta controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::ruta.ruta', {

    async find(ctx) {
        console.log("Datos del Usuario: ", ctx.state.user);
        const user = ctx.state.user;

        ctx.query = {
            populate: {
                personal: {
                    populate:{
                        usuario:true
                    }
                }
            }
        }
        const result = await super.find(ctx); //Obtiene los datos de la consulta
        return result; //Regresa los datos
    }


});
