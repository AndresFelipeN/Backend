productosModel = {}


//Table maestra base de datos, esquema
const mongoose = require ('mongoose')
var Schema = mongoose.Schema
//definicion del objeto schema
var productosSchema = new Schema({
    nombre:String,
    codigo:String,
    precio:Number,
    descripcion:String,
    imagen:String,
    estado:String, //aca listamos por activo o inactivo
    cantidad:Number
})

const Mymodel = mongoose.model("productos" ,productosSchema)


//es una funcion que recibe datos, en el controllador los datos es una variable que llamamos post
//callback es la devolucionde de informacion desde el modelo al controlador
//una vez que conectamos mongo (base de datos) comentamos las suigientes partes del codigo
productosModel.guardar = function(post, callback){
    //una vez identificamos si los datos no existen pasamos a guardar
    //se necesita una instancia
    //estamos tomando los datos del frond end y los organizamos en la coleccion
    const instancia = new Mymodel
    instancia.nombre = post.nombre
    instancia.codigo = post.codigo
    instancia.precio = parseInt (post.precio) //parse in convierte a entero
    instancia.descripcion = post.descripcion
    instancia.estado = post.estado
    instancia.cantidad = post.cantidad
   /*  Acontinuacion le estamos diciendo que si el formato imagen se guarda en blanco se le va otorgar una 
    imagen por defecto */
    if(post.imagen == undefined || post.imagen == null || post.imagen == ""){
        console.log(imagen)
        instancia.imagen = "assets/noimagen.jpg" //aca asignamos una por defecto
    }
    else{
        instancia.imagen = post.imagen //aca la que le asigne el admin 

    }
    
    

    //almacenamos la informacion
     instancia.save().then((respuesta) => {
     console.log(respuesta)
     return callback ({state:true, mensaje:"Elemento guardado"})

     }).catch ((error) => {
        console.log(error)
        return callback ({state:false, mensaje:"se presento un error"})
      })
     

    // bdproductos.push(post) -> aca estamos inyectando los productos gurdados en el array bdproductos
    // return callback ({state:true, mensaje:"Elemento guardado"})
}

//    read o leer
productosModel.listar = function(post, callback){
   //integracion de listar con mongo 
   //con password 0 estamos ocultando la contraseña de el listar
   Mymodel.find({}, {}).then ((respuesta) => {

    return callback({state:true, datos:respuesta})
   })
   .catch ((error) => {
    return callback ({state:false, datos:[], error:error, mensaje:"se presento un error"})
   })

    //return callback({state:true, datos:bdproductos}) -> estamos trayendo los datos almacenados en el array
}

productosModel.listarproductosactivos = function(post, callback){
    //integracion de listar con mongo 
    // 1 es valor de activo 
    Mymodel.find({estado:"1"}, {}).then ((respuesta) => {
 
     return callback({state:true, datos:respuesta})
    })
    .catch ((error) => {
     return callback ({state:false, datos:[], error:error, mensaje:"se presento un error"})
    })
 
     //return callback({state:true, datos:bdproductos}) -> estamos trayendo los datos almacenados en el array
}
 
productosModel.listarId = function(post, callback){
    //integracion de listar con mongo 
    //con password 0 estamos ocultando la contraseña de el listar
    Mymodel.find({_id:post._id}, {}).then ((respuesta) => {
 
     return callback({state:true, datos:respuesta})
    })
    .catch ((error) => {
     return callback ({state:false, datos:[], error:error, mensaje:"se presento un error"})
    })
 
    //return callback({state:true, datos:bdproductos}) -> estamos trayendo los datos almacenados en el array
}

productosModel.existecodigo = function (post, callback){

    Mymodel.findOne({codigo:post.codigo},{}).then((respuesta) =>{
        //el null es la respuesta del servidor si los datos ingresados no existen
        if (respuesta == null){
            return callback({existe:'no'})
        }
        else {
            return callback({existe:'si'})
        }
    })
    //hacer busqueda en elementos
    //var posicion =bdproductos.findIndex((item) => item.codigo == post.codigo)
    //Igual o mayor a cero significa que si existe
    // if(posicion >=0){
    //     return callback({existe:'si'})
    // }
    // else {
    //     return callback({existe:'no'})
    // }

}


productosModel.actualizar = function (post, callback){

    Mymodel.findByIdAndUpdate(post._id, // Mymodel.findOneAndUpdate({_id:post._id} es una opcion
        {
            nombre:post.nombre,
            precio:post.precio,
            descripcion:post.descripcion,
            imagen:post.imagen,
            estado:post.estado,
            cantidad:post.cantidad

        }).then((respuesta) => {
            return callback ({state:true, mensaje:"Elemento actualizado"})
            console.log(respuesta)

        })
        .catch ((error) => {
            return callback ({state:false, mensaje:"Error al actualizar", error:error})
        })
        
                     
        
}

productosModel.eliminar = function (post, callback){

    Mymodel.findByIdAndDelete(post._id,) .then((respuesta) => {
            return callback ({state:true, mensaje:"Elemento eliminado"})
            console.log(respuesta)

        })
        .catch ((error) => {
            return callback ({state:false, mensaje:"Error al eliminado", error:error})
        })
                     
        
}

module.exports.productosModel = productosModel