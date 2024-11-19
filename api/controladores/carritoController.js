var carritoModel = require ('../modelos/carritoModel.js').carritoModel

var carritoController = {}

//guardar es un metodo, que es igual a una funcion que recibe un request que retorna un response
carritoController.guardar = function(request, response)
{
    var post = 
    {   nombre: request.body.nombre,
        _idproducto:request.body._idproducto,
        cantidad:request.body.cantidad,
        precio:request.body.precio,
        _idusuario:request.session._id
          
        
    }
  
  //Codicionales
    //Van antes del push
    if(post.nombre == null || post.nombre == undefined || post.nombre == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo nombre es obligatorio"})
        //frena el procesp
        return false
    }
    
    if(post._idproducto == null || post._idproducto == undefined || post._idproducto == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo idproducto es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.cantidad == null || post.cantidad == undefined || post.cantidad == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo cantidad es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.precio == null || post.precio == undefined || post.precio == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo precio es obligatorio"})
        //frena el procesp
        return false
    }

   



    //guardar en el modelo(modelos) se importa
    //los callback se capturan creando funciones
    // Validacion para no gurdar codigos que ya existe
    carritoModel.existecodigo(post, function(res){

        if(res.existe == 'si'){
         response.json({state:false,mensaje: "ste producto ya existe en tu carrito de compras actualiza la cantidad"})
         return false
        }
        else{

            carritoModel.guardar(post,function(respuesta){
                response.json(respuesta)
            })
        }
    })


    
    
    


   


}

carritoController.listar = function(request, response){
    
    var post = {  
        _idusuario:request.session._id
    }

    if(post._idusuario == null || post._idusuario == undefined || post._idusuario == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo _idusuario es obligatorio"})
        //frena el proceso
        return false
    }
    
    carritoModel.listar(post, function(respuesta){
        response.json(respuesta)
    })
    
    
}

carritoController.listarId = function(request, response){
    var post = {
        _id:request.body._id
    }

    if(post._id == null || post._id == undefined || post._id == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo _id es obligatorio"})
        //frena el proceso
        return false
    }
    carritoModel.listarId(post, function(respuesta){
        response.json(respuesta)
    })
    
    
}

carritoController.actualizar = function (request, response){

    var post = {
        _id:request.body._id,
        _idusuario:request.session._id,
        cantidad:request.body.cantidad
    }

    if(post.cantidad == null || post.cantidad == undefined || post.cantidad == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo cantidad es obligatorio"})
        //frena el procesp
        return false
    }

    //se necesita el id ya que en este caso estomos haciendo busqueda por el id mongo

    if(post._id == null || post._id == undefined || post._id == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo _id es obligatorio"})
        //frena el procesp
        return false
    }

    carritoModel.actualizar(post, function(respuesta){
        response.json(respuesta)
    })

    
}

carritoController.eliminar = function (request, response){

    var post = {
        _id:request.body._id,
        _idusuario:request.session._id
        
    }


    //se necesita el id ya que en este caso estomos haciendo busqueda por el id mongo

    if(post._id == null || post._id == undefined || post._id == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo _id es obligatorio"})
        //frena el procesp
        return false
    }

    carritoModel.eliminar(post, function(respuesta){
        response.json(respuesta)
    })

    
}

//este objeto esta asignado a una variable por ende va tener todas las funciones que se asignen en la variable
module.exports.carritoController = carritoController