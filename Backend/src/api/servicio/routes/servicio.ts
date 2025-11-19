/**
 * servicio router
 */

import { factories } from '@strapi/strapi';

// export default factories.createCoreRouter('api::servicio.servicio');

export default {
    routes: [
        {
            method: 'GET',
            path: '/servicios',
            handler: 'servicio.find',
        },
        {
            method: 'GET',
            path: '/servicios-by-ruta/:id',
            handler: 'servicio.getServiciosByRuta',
        },
        {
            method: 'POST',
            path: '/servicios',
            handler: 'servicio.create',
        },
        {
            method: 'PUT',
            path: '/servicios/:id',
            handler: 'servicio.update',
        },
        {
            method: 'DELETE',
            path: '/servicios/:id',
            handler: 'servicio.delete',
        },
        {
            method: 'GET',
            path: '/servicios/:id',
            handler: 'servicio.findOne',
        },
        {
            method: 'GET',
            path: '/servicios-hoy/:estado',
            handler: 'servicio.getServicioByFecha',
        },
        {
            method: 'GET',
            path: '/servicios-programados',
            handler: 'servicio.getServicioProgramado',
        }
        // {
        //     method: 'PUT',
        //     path: '/update-only-estado-servicios/:id',
        //     handler: 'servicio.updateEstado',
        // },
    ]
}
