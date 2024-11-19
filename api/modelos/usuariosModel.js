usuariosModel = {}


//Table maestra base de datos, esquema
const mongoose = require ('mongoose')
var Schema = mongoose.Schema
//definicion del objeto schema
var usuariosSchema = new Schema({
    nombre:String,
    email:String,
    password:String,
    edad:Number,
    telefono:Number,
    direccion:String,
    errorlogin:Number,
    fechalogin:Date,
    azar:String,
    //Activacion de la cuenta esta asociada entra la activacion de la cuenta y el Azar
    estado:String,
    //Recuperacion de contraseña
    codepass:String,
    ultlogin:Date,
    rol:String

})

const Mymodel = mongoose.model("usuarios" ,usuariosSchema)


usuariosModel.guardar = function(post, callback){
   
     const instancia = new Mymodel
     instancia.nombre = post.nombre
     instancia.email = post.email
     instancia.telefono = post.telefono
     instancia.direccion = post.direccion
     instancia.password = post.password
     instancia.edad = post.edad
     instancia.fechalogin = new Date()
     instancia.errorlogin = 0;
     instancia.estado = "1"
     instancia.rol = post.rol //1 admin, 2 Facturador, 3 cliente

    //almacenamos la informacion
     instancia.save().then((respuesta) => {
     console.log(respuesta)
     return callback ({state:true, mensaje:"usuario guardado"})

     }).catch ((error) => {
        console.log(error)
        return callback ({state:false, mensaje:"se presento un error"})
      })
     

    
}

usuariosModel.registrar = function(post, callback){
    
     const instancia = new Mymodel
     instancia.nombre = post.nombre
     instancia.email = post.email
     instancia.password = post.password
     instancia.edad = post.edad
     instancia.fechalogin = new Date()
     instancia.errorlogin = 0;
     instancia.estado = "0"
     instancia.azar = post.azar
     instancia.rol = "3"

    //almacenamos la informacion
     instancia.save().then((respuesta) => {
     console.log(respuesta)
     return callback ({state:true, mensaje:"usuario guardado"})

     }).catch ((error) => {
        console.log(error)
        return callback ({state:false, mensaje:"se presento un error"})
      })
     

    
}

usuariosModel.listar = function(post, callback){
   //integracion de listar con mongo 
   //con password 0 estamos ocultando la contraseña de el listar
   Mymodel.find({}, {password:0}).then ((respuesta) => {

    return callback({state:true, datos:respuesta})
   })
   .catch ((error) => {
    return callback ({state:false, datos:[], error:error, mensaje:"se presento un error"})
   })

    
}

//   Validalogin basado en la fecha
usuariosModel.validalogin = function(post, callback){
    Mymodel.findOne({email:post.email},{fechalogin:1,errorlogin:1}).then((respuesta) => {
       return callback(respuesta)
    }) .catch ((error)=> {
        return callback(error)
    })
}

//   Actualizar errores, tres errores para bloquear
usuariosModel.actualizarerrores = function(post, callback){
    Mymodel.findOneAndUpdate({email:post.email}, {
    errorlogin:post.cantidad, // esta cantidad viene del controlador validacion.errorloing
    fechalogin: new Date ()

    }).then((respuesta)=>{
        console.log(respuesta)
       return callback ({state:true, mensaje: "Elemento Actualizado"})
    }) .catch ((error)=> {
        return callback ({state:false, mensaje: "Error al actualizar", error:error})
    })
}

usuariosModel.listarId = function(post, callback){
   
    Mymodel.find({_id:post._id}, {password:0}).then ((respuesta) => {
 
     return callback({state:true, datos:respuesta})
    })
    .catch ((error) => {
     return callback ({state:false, datos:[], error:error, mensaje:"se presento un error"})
    })
 
    
}

usuariosModel.existeemail = function (post, callback){

    Mymodel.findOne({email:post.email},{}).then((respuesta) =>{
        //el null es la respuesta del servidor si los datos ingresados no existen
        if (respuesta == null){
            return callback({existe:'no'})
        }
        else {
            return callback({existe:'si'})
        }
    })
    //hacer busqueda en elementos
    //var posicion =bdusuarios.findIndex((item) => item.email == post.email)
    //Igual o mayor a cero significa que si existe
    // if(posicion >=0){
    //     return callback({existe:'si'})
    // }
    // else {
    //     return callback({existe:'no'})
    // }

}

usuariosModel.login = function (post, callback){
    

    //El modelo acontinuacion esta buscando en base de datos para login
    //Estado nos dice que la cuenta se debio haber activado si esta en uno
    Mymodel.find({email:post.email, password:post.password, estado: "1"},{})
       .then ((respuesta) => {
           if (respuesta.length ==1){
            return callback({state:true, mensaje: "Bienvenido: " + respuesta[0]. nombre, data:respuesta})
           }
           else {
            return callback ({state:false, datos:[], error:error, mensaje:"se presento un error al ingresar"})
           }
       })
       .catch ((error) => {
        return callback ({state:false, mensaje:"Credenciales Invalidas o cuenta inactiva" })
    })


}

usuariosModel.guardarcodigorecuperacion  = function (post,callback){

    Mymodel.findOneAndUpdate({email:post.email},
        {
            codepass:post.codigo

        }) .then((respuesta) => {
            return callback ({state:true, mensaje:"Hemos enviado un correo electronico por favor verifica"})
            console.log(respuesta)

        })
        .catch ((error) => {
            return callback ({state:false, mensaje:"Error al generar codigo", error:error})
        })
             

}

usuariosModel.recuperarpass  = function (post,callback){

    Mymodel.findOneAndUpdate({email:post.email, codepass:post.codigo},
        {
            password:post.password

        }) .then((respuesta) => {
            console.log(respuesta)
            if(respuesta == null){
                return callback({state:false})
            }
            else {
                return callback ({state:true})
            }

            
           
        })
        .catch ((error) => {
            return callback ({state:false})
        })
             

}

usuariosModel.filtronombre = function (post, callback){
    //Filter nos ayuda a filtrar datos por nombre
    var datosfiltrados =bdusuarios.filter((item)=> item.nombre == post.nombre)
    return callback = ({state:true, datos:bdusuarios})
}

usuariosModel.actualizar = function (post, callback){

    Mymodel.findByIdAndUpdate(post._id, // Mymodel.findOneAndUpdate({_id:post._id} es una opcion
        {
            nombre:post.nombre,
            rol:post.rol,
            estado:post.estado,
            direccion:post.direccion,
            telefono:post.telefono
        

        }) .then((respuesta) => {
            return callback ({state:true, mensaje:"Elemento actualizado"})
            console.log(respuesta)

        })
        .catch ((error) => {
            return callback ({state:false, mensaje:"Error al actualizar", error:error})
        })
                     
        
}

usuariosModel.actualizarfechalogin = function (post, callback){

    Mymodel.findOneAndUpdate({email:post.email, password:post.password}, 
        {
            
            ultlogin: new Date()
        

        }) .then((respuesta) => {
            return callback ({state:true, mensaje:"Elemento actualizado"})
            console.log(respuesta)

        })
        .catch ((error) => {
            return callback ({state:false, mensaje:"Error al actualizar", error:error})
        })
                     
        
}

usuariosModel.activar = function (post, callback){

    Mymodel.findOneAndUpdate({email:post.email, azar:post.azar},
        { 
            estado:"1"

        }) .then((respuesta) => {

            console.log(respuesta)
            if (respuesta == null){
                return callback ({state:false, mensaje:"Su email y codigo no son aptos para activar la cuenta "})
            }
            else {
                return callback ({state:true, mensaje:"Cuenta activada"})
            }

        }) .catch ((error) => {})
        
                     
        
}

usuariosModel.eliminar = function (post, callback){

    Mymodel.findByIdAndDelete(post._id,) .then((respuesta) => {
            return callback ({state:true, mensaje:"Elemento eliminado"})
            console.log(respuesta)

        })
        .catch ((error) => {
            return callback ({state:false, mensaje:"Error al eliminado", error:error})
        })
                     
        
}


module.exports.usuariosModel = usuariosModel