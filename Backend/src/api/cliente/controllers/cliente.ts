/**
 * cliente controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::cliente.cliente', {


    async findByPhone(ctx) {
        const user = ctx.state.user;
        console.log("Telefono a buscar :", ctx.params.id)
        // const {phone} = ctx.params.phone


        const cliente = await strapi.documents('api::cliente.cliente').findFirst({
            populate: {
                domicilios: true
            },
            filters: {
                telefono: {
                    $eq: ctx.params.id
                },
            }
        })

        // if (!cliente) {
        //     return ctx.throw(404, "Cliente no Encontrado")
        // }
        console.log("Cliente Encontrado: ", cliente)
        return cliente;
    },

    async find(ctx) {
        ctx.query = {
            populate: {
                domicilios: true
            },
        }
        const result = await super.find(ctx); //Obtiene los datos de la consulta
        return result; //Regresa los datos
    },
    async findOne(ctx) {
        ctx.query = {
            populate: {
                domicilios: true
            },
        }
        const result = await super.findOne(ctx); //Obtiene los datos de la consulta
        return result; //Regresa los datos
    },



});
