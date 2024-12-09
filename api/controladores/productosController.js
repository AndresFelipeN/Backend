//const Mymodel = require('../modelos/productosModel.js')

var productosModel = require ('../modelos/productosModel.js').productosModel

var productosController = {}

//guardar es un metodo, que es igual a una funcion que recibe un request que retorna un response
productosController.guardar = function(request, response)
{
    var post = 
    {   nombre: request.body.nombre,
        codigo: request.body.codigo,
        precio: request.body.precio,
        descripcion: request.body.descripcion,
        imagen: request.body.imagen,
        estado: request.body.estado,
       /*  cantidad: request.body.cantidad, */
        tipo:request.body.tipo,
        tallas: request.body.tallas,
        material: request.body.material,
        color: request.body.color,

          
        
    }
  
  //Codicionales
    //Van antes del push
    if(post.nombre == null || post.nombre == undefined || post.nombre == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo nombre es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.codigo == null || post.codigo == undefined || post.codigo == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo codigo es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.precio == null || post.precio == undefined || post.precio == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo precio es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.descripcion == null || post.descripcion == undefined || post.descripcion == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo descripcion es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.estado == null || post.estado == undefined || post.estado == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo estado es obligatorio"})
        //frena el procesp
        return false
    }


    if(post.tipo == null || post.tipo == undefined || post.tipo == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo tipo es obligatorio"})
        //frena el procesp
        return false
    }


    if(post.color == null || post.color == undefined || post.color == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo color es obligatorio"})
        //frena el procesp
        return false
    }



    if(post.material == null || post.material == undefined || post.material == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo material es obligatorio"})
        //frena el procesp
        return false
    }

    if (!Array.isArray(post.tallas) || post.tallas.length === 0) {  
        return response.json({ state: false, mensaje: "debe proporcionar al menos una talla con cantidad" });  
    }  

    // Validar que cada talla tenga la propiedad 'talla' y 'cantidad'  
    for (let i = 0; i < post.tallas.length; i++) {  
        if (!post.tallas[i].talla || post.tallas[i].cantidad == null) {  
            return response.json({ state: false, mensaje: `debe proporcionar valores válidos para talla en el índice ${i}` });  
        }  
    }  
    
    
    //guardar en el modelo(modelos) se importa
    //los callback se capturan creando funciones
    // Validacion para no gurdar codigos que ya existe
    productosModel.existecodigo(post, function(res){

        if(res.existe == 'si'){
         response.json({state:false,mensaje: "el codigo ya esta registrado"})
         return false
        }
        else{

            productosModel.guardar(post,function(respuesta){
                response.json(respuesta)
            })
        }
    })


}

productosController.listar = function(request, response){
    
    productosModel.listar(null, function(respuesta){
        response.json(respuesta)
    })
    
    
}

productosController.listarproductosactivos = function(request, response){
    
    productosModel.listarproductosactivos(null, function(respuesta){
        response.json(respuesta)
    })
    
}

productosController.listarproductostipo = function(request, response){
   //console.log(request.body) 
    productosModel.listarproductostipo(request, function(respuesta){
        response.json(respuesta)
    })
}

productosController.listarId = function(request, response){
    var post = {
        _id:request.body._id
    }

    if(post._id == null || post._id == undefined || post._id == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo _id es obligatorio"})
        //frena el procesp
        return false
    }
    productosModel.listarId(post, function(respuesta){
        response.json(respuesta)
    })
    
    
}

productosController.actualizar = function (request, response){

    var post = {
        _id:request.body._id,
        nombre:request.body.nombre,
        precio: request.body.precio,
        descripcion: request.body.descripcion,
        imagen: request.body.imagen,
        estado: request.body.estado,
        /* cantidad: request.body.cantidad, */
        tipo: request.body.tipo,
        tallas: request.body.tallas,
        material: request.body.material,
        color: request.body.color,
    }

    if(post.nombre == null || post.nombre == undefined || post.nombre == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo nombre es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.precio == null || post.precio == undefined || post.precio == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo precio es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.descripcion == null || post.descripcion == undefined || post.descripcion == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo descripcion es obligatorio"})
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

    if(post.estado == null || post.estado == undefined || post.estado == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo estado es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.tipo == null || post.tipo == undefined || post.tipo == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo tipo es obligatorio"})
        //frena el procesp
        return false
    }

    if (!Array.isArray(post.tallas) || post.tallas.length === 0) {  
        return response.json({ state: false, mensaje: "debe proporcionar al menos una talla con cantidad" });  
    }  

    // Validar que cada talla tenga la propiedad 'talla' y 'cantidad'  
    for (let i = 0; i < post.tallas.length; i++) {  
        if (!post.tallas[i].talla || post.tallas[i].cantidad == null) {  
            return response.json({ state: false, mensaje: `debe proporcionar valores válidos para talla en el índice ${i}` });  
        }  
    }  

    if(post.color == null || post.color == undefined || post.color == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo color es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.material == null || post.material == undefined || post.material == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo material es obligatorio"})
        //frena el procesp
        return false
    }

    productosModel.actualizar(post, function(respuesta){
        response.json(respuesta)
    })

    
}

productosController.eliminar = function (request, response){

    var post = {
        _id:request.body._id
        
    }


    //se necesita el id ya que en este caso estomos haciendo busqueda por el id mongo

    if(post._id == null || post._id == undefined || post._id == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo _id es obligatorio"})
        //frena el procesp
        return false
    }

    productosModel.eliminar(post, function(respuesta){
        response.json(respuesta)
    })

    
}

/* productosController.talla = async function  (request, response){

    const producto = request.query.tipo
    console.log(typeof producto)
    
    try {
        const tipoproducto = await Mymodel.aggregate([
            { $match: { tipo: producto } },
            { $group: { _id: "$talla", total: { $sum: "$cantidad" } } }, 
            { $sort: { _id: 1 } }
        ])
        response.json(tipoproducto)
    } catch (error) {
        console.log(error)
        response.status(500).json ('Hubo un error')
        
    }

    
} */

productosController.listarproductostallas = function(request, response){
    var post = {
        
        tallas:request.body.tallas
    }

    if (!Array.isArray(post.tallas) || post.tallas.length === 0) {  
        return response.json({ state: false, mensaje: "debe proporcionar al menos una talla con cantidad" });  
    }  

    // Validar que cada talla tenga la propiedad 'talla' y 'cantidad'  
    for (let i = 0; i < post.tallas.length; i++) {  
        if (!post.tallas[i].talla || post.tallas[i].cantidad == null) {  
            return response.json({ state: false, mensaje: `debe proporcionar valores válidos para talla en el índice ${i}` });  
        }  
    }  
    
} 


//este objeto esta asignado a una variable por ende va tener todas las funciones que se asignen en la variable
module.exports.productosController = productosController