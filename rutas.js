
//                                 Usuarios

var usuariosController = require('./api/controladores/usuariosController.js').usuariosController


//                        middleware
var soloadmin = function (request, response, next){
  if (request.session.rol == "1"){
    next ()
  }
   else {
    response.json({state:false,mensaje: "Esta Api es de uso exclusivo del administrador"})
   } 

}

app.post('/usuarios/guardar', soloadmin, function(request,response){
  //acontinucacion vamos a usar la funcion
  usuariosController.guardar(request, response)
    
})

app.post('/usuarios/listar', soloadmin, function(request,response){
  //acontinucacion vamos a usar la funcion
  usuariosController.listar(request, response)
})
                  
app.post('/usuarios/listarId', soloadmin , function(request,response){
  //acontinucacion vamos a usar la funcion
  usuariosController.listarId(request, response)
})
                    
app.post('/usuarios/actualizar', soloadmin, function(request,response){
  //acontinucacion vamos a usar la funcion
  usuariosController.actualizar(request, response)
})
                                                  
app.post('/usuarios/login', function(request,response){
  //acontinucacion vamos a usar la funcion
  usuariosController.login(request, response)
    
})

app.post('/usuarios/solicitarcodigo', function(request,response){
  
  usuariosController.solicitarcodigo(request, response)
    
})

app.post('/usuarios/recuperarpass', function(request,response){
  
  usuariosController.recuperarpass(request, response)
    
})

app.post('/activar', function(request,response){
  //acontinucacion vamos a usar la funcion
  usuariosController.activar(request, response)
    
})

app.post('/usuarios/filtronombre', function(request,response){
  
  usuariosController.filtronombre(request, response)
    
})

app.post('/usuarios/eliminar', soloadmin, function(request,response){
  
  usuariosController.eliminar(request, response)
    
})

app.post('/usuarios/registro', function(request,response){
  
  usuariosController.registro(request, response)
    
})

app.post('/status', function(request,response){
  
  response.json(request.session)
    
})

app.post('/logout', function(request,response){
  //destruyendo la sesion
  request.session.destroy()
  response.json({state:true, mensaje: "Se ha cerrado su Sesion Correctamente"})
    
})

app.get('/usuarios/exportarexel', function(request,response){
  //acontinucacion vamos a usar la funcion
  usuariosController.exportarexel(request, response)
    
})

app.get('/usuarios/exportarpdf', function (request,response){
  usuariosController.exportarpdf(request, response)

})







///                                 PRODUCTOS                                                         ///


var productosController = require('./api/controladores/productosController.js').productosController


app.post('/productos/guardar', function(request,response){
  
  productosController.guardar(request, response)
    
})
                 
app.post('/productos/listar', function(request,response){
  
  productosController.listar(request, response)
})

app.post('/productos/listarproductosactivos', function(request,response){
  
  productosController.listarproductosactivos(request, response)
})

app.post('/productos/listarproductostipo', function(request,response){
  
  productosController.listarproductostipo(request, response)
})

app.post('/productos/listarId', function(request,response){
  
  productosController.listarId(request, response)
})

app.post('/productos/actualizar', function(request,response){
  
  productosController.actualizar(request, response)
})
                      
app.post('/productos/eliminar', function(request,response){
  
  productosController.eliminar(request, response)
    
})

app.post('/productos/talla', function(request,response){
  
  productosController.talla(request, response)
    
})

app.post('/productos/listarproductostallas', function(request,response){
  
  productosController.listarproductostallas(request, response)
})






//                                 ARCHIVOS           

var archivosController = require('./api/controladores/archivosController.js').archivosController

app.post('/subirproductos/:nombre', function(request,response){
  //acontinucacion vamos a usar la funcion
  archivosController.subirproductos(request, response)
    
})


//                                Avatar
app.post('/subiravatar/:nombre', function(request,response){
  //acontinucacion vamos a usar la funcion
  archivosController.subiravatar(request, response)
    
})


//                                   CARRITO

var carritoController = require('./api/controladores/carritoController.js').carritoController

//               Guardar carrito
app.post('/carrito/guardar', function(request,response){
  //acontinucacion vamos a usar la funcion
  carritoController.guardar(request, response)
    
})


//                     Listar carrito
app.post('/carrito/listar', function(request,response){
  //acontinucacion vamos a usar la funcion
  carritoController.listar(request, response)
})

//                         Listar Id
app.post('/carrito/listarId', function(request,response){
  //acontinucacion vamos a usar la funcion
  carritoController.listarId(request, response)
})


//                       Actualizar carrito
app.post('/carrito/actualizar', function(request,response){
  //acontinucacion vamos a usar la funcion
  carritoController.actualizar(request, response)
})
                      


//                             Eliminar
app.post('/carrito/eliminar', function(request,response){
  //acontinucacion vamos a usar la funcion
  carritoController.eliminar(request, response)
    
})






