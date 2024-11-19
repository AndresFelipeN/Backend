carritoModel = {}
var bdcarrito = [] //Array

//Table maestra base de datos, esquema
const mongoose = require ('mongoose')
var Schema = mongoose.Schema
//definicion del objeto schema
var carritoSchema = new Schema({
    nombre:String,
    _idproducto:String,
    cantidad:Number,
    precio:Number,
    _idusuario:String
})

const Mymodel = mongoose.model("carrito" ,carritoSchema)


carritoModel.guardar = function(post, callback){
    //una vez identificamos si los datos no existen pasamos a guardar
    //se necesita una instancia
    //estamos tomando los datos del frond end y los organizamos en la coleccion
    const instancia = new Mymodel
    instancia.nombre = post.nombre
    instancia.codigo = post.codigo
    instancia._idproducto = post._idproducto
    instancia.precio = post.precio
    instancia.cantidad = post.cantidad
    instancia._idusuario = post._idusuario
    



    

    //almacenamos la informacion
     instancia.save().then((respuesta) => {
     console.log(respuesta)
     return callback ({state:true, mensaje:"Elemento guardado"})

     }).catch ((error) => {
        console.log(error)
        return callback ({state:false, mensaje:"Se presento un error"})
      })
     

    // bdcarrito.push(post) -> aca estamos inyectando los carrito gurdados en el array bdcarrito
    // return callback ({state:true, mensaje:"Elemento guardado"})
}

//    read o leer
carritoModel.listar = function(post, callback){
   //integracion de listar con mongo 
   //con password 0 estamos ocultando la contraseña de el listar
   Mymodel.find({_idusuario:post._idusuario}, {}).then ((respuesta) => {

    return callback({state:true, datos:respuesta})
   })
   .catch ((error) => {
    return callback ({state:false, datos:[], error:error, mensaje:"se presento un error"})
   })

    //return callback({state:true, datos:bdcarrito}) -> estamos trayendo los datos almacenados en el array
}

//      Listar por Id

carritoModel.listarId = function(post, callback){
    //integracion de listar con mongo 
    //con password 0 estamos ocultando la contraseña de el listar
    Mymodel.find({_id:post._id}, {}).then ((respuesta) => {
 
     return callback({state:true, datos:respuesta})
    })
    .catch ((error) => {
     return callback ({state:false, datos:[], error:error, mensaje:"se presento un error"})
    })
 
    //return callback({state:true, datos:bdcarrito}) -> estamos trayendo los datos almacenados en el array
}

carritoModel.existecodigo = function (post, callback){

    Mymodel.findOne({_idproducto:post._idproducto,_idusuario:post._idusuario},{}).then((respuesta) =>{
        //el null es la respuesta del servidor si los datos ingresados no existen
        if (respuesta == null){
            return callback({existe:'no'})
        }
        else {
            return callback({existe:'si'})
        }
    })
    //hacer busqueda en elementos
    //var posicion =bdcarrito.findIndex((item) => item.codigo == post.codigo)
    //Igual o mayor a cero significa que si existe
    // if(posicion >=0){
    //     return callback({existe:'si'})
    // }
    // else {
    //     return callback({existe:'no'})
    // }

}


carritoModel.actualizar = function (post, callback){

    Mymodel.findOneAndUpdate({_id:post._id,_idusuario:post._idusuario}, // Mymodel.findOneAndUpdate({_id:post._id} es una opcion
        {
            cantidad:post.cantidad

        }) .then((respuesta) => {
            return callback ({state:true, mensaje:"Elemento actualizado"})
            console.log(respuesta)

        })
        .catch ((error) => {
            return callback ({state:false, mensaje:"Error al actualizar", error:error})
        })
                     
        
}

carritoModel.eliminar = function (post, callback){

    Mymodel.findOneAndDelete({_id:post._id,_idusuario:post._idusuario}) .then((respuesta) => {
            return callback ({state:true, mensaje:"Elemento eliminado"})
            console.log(respuesta)

        })
        .catch ((error) => {
            return callback ({state:false, mensaje:"Error al eliminado", error:error})
        })
                     
        
}

module.exports.carritoModel = carritoModel