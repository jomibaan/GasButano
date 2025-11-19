// export default{
//     async afterCreate(event){
//         const {result, params} = event;
//         console.log('Evento: ',result)
//         console.log('Params: ',params)

//         try{
//             const data ={
//                 'documentId': result.id,
//                 'calle':params.data.calle,
//                 'colonia':params.data.colonia,
//                 'numero':params.data.numero,
//                 'cp':params.data.cp,
//                 'referencia':params.data.referencia
//             }
//             const domicilio = await strapi.documents('api::domicilio.domicilio').create({data})
//         }catch{

//         }
//     }
// }