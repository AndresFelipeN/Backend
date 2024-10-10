const { config } = require('../../config.js')

//Controller
var usuariosController = {}
//Model
var usuariosModel = require ('../modelos/usuariosModel.js').usuariosModel
var nodemailer = require ('nodemailer')


function tiempoTranscurridoEnMinutos(fechaTexto){
    // Convertir la fecha en texto a un objeto Date
    const fechaComparar = new Date (fechaTexto)

    //Obtener la fecha actual
    const fechaActual = new Date ()

    //Calcular la diferencia en milisegundos
    const diferenciaMilisegundos = fechaActual - fechaComparar

    //Convertir la diferencia a minutos (1 minuto = 60000 milisegundos)
    const diferenciaMinutos =  Math.floor(diferenciaMilisegundos / 60000)

    return diferenciaMinutos
}


usuariosController.guardar = function(request, response)
{
    var post = 
    {   nombre: request.body.nombre,
        email: request.body.email,
        password: request.body.password,
        estado: request.body.estado,
        rol: request.body.rol
        
        
        
    }
  
  
    if(post.nombre == null || post.nombre == undefined || post.nombre == ""){
        
        response.json ({state:false,mensaje:"el campo nombre es obligatorio"})
        
        return false
    }

    if(post.estado == null || post.estado == undefined || post.estado == ""){
        
        response.json ({state:false,mensaje:"el campo estado es obligatorio"})
        
        return false
    }

    if(post.rol == null || post.rol == undefined || post.rol == ""){
       
        response.json ({state:false,mensaje:"el campo rol es obligatorio"})
        
        return false
    }

    // Length nos ayuda a establecer el numero maximo de caracteres peritidos
    if(post.nombre.length > 20){
        response.json ({state:false,mensaje:"el campo nombre no debe superar 20 caracteres"})
        return false

    }


    
    if(post.email == null || post.email == undefined || post.email == ""){
        
        response.json ({state:false,mensaje:"el campo email es obligatorio"})
        
        return false
    }


    
    //rex.text nos permite confirmr si un email es valido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(regex.test(post.email) == false){
        response.json({state:false,mensaje: "el campo email no es valido"})
    }

    if(post.password == null || post.password == undefined || post.password == ""){
        
        response.json ({state:false,mensaje:"el campo password es obligatorio"})
        
        return false
    }
    
    // Acontinuacion vamos a encryptar la contraseña que el usuario ingreso
    // estamos adicional mente concatenando una parabra que se almacena en Config

    post.password = SHA256(post.password + config.palabraclave) 




    
    usuariosModel.existeemail(post, function(res){

        if(res.existe == 'si'){
         response.json({state:false,mensaje: "el email ya esta registrado"})
         return false
        }
        else{

            usuariosModel.guardar(post,function(respuesta){
                response.json(respuesta)
            })
        }
    })


    
    
    


   


}


usuariosController.registro = function(request, response)
{
    var post = 
    {   nombre: request.body.nombre,
        email: request.body.email,
        password: request.body.password,
        
        
        
    }
  
  //Codicionales
    //Van antes del push
    if(post.nombre == null || post.nombre == undefined || post.nombre == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo nombre es obligatorio"})
        //frena el procesp
        return false
    }

    // Length nos ayuda a establecer el numero maximo de caracteres peritidos
    if(post.nombre.length > 20){
        response.json ({state:false,mensaje:"el campo nombre no debe superar 20 caracteres"})
        return false

    }


    
    if (post.email == null || post.email == undefined || post.email == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo email es obligatorio"})
        //frena el procesp
        return false
    }


    
    //rex.text nos permite confirmr si un email es valido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(regex.test(post.email) == false){
        response.json({state:false,mensaje: "el campo email no es valido"})
    }

    if(post.password == null || post.password == undefined || post.password == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo password es obligatorio"})
        //frena el proceso
        return false
    }

    // Acontinuacion vamos a encryptar la contraseña que el usuario ingreso
    post.password = SHA256(post.password + config.palabraclave) 



    //guardar en el modelo(modelos) se importa
    //los callback se capturan creando funciones
    // Validacion para no gurdar emails que ya existe
     usuariosModel.existeemail(post, function(res){

        if(res.existe == 'si'){
         response.json({state:false,mensaje: "el email ya esta registrado"})
         return false
        }
        else{
            //Variable para establecer numero aleatorio 
            var azar = 'G-' + Math.floor(Math.random() * (9999 - 1000) + 1000);
            //esta variable se esta usando para marcar como activo o desactivado un usuario
            post.azar = azar
            
            usuariosModel.registrar(post,function(respuesta){

                const transporter = nodemailer.createTransport ({
                    // Host es el servidor de correo que vamos a utilizar (google en este caso)
                    host: config.email.host,
                    //Puerto por el que sale el correo electronico, se configura en el config
                    port:config.email.port,
                    // Tiene valor de false
                    secure:false,
                    //TLS
                    requireTLS:true,
                    //Un obeto, contiene las credenciales de acceso al usuario de Gmail, se agrega en config
                    auth:{
                      user:config.email.user,
                      pass:config.email.pass
                    }
                })
                
                //Envio de coreo de verificacion
                var mailOptions = {
                    // De donde sale el correo
                    from:config.email.user,
                    // Para quien va el correo
                    to:post.email,
                    subject: "Verifica tu cuenta con el codigo: " + azar,
                    //Cuerpo del email que se envia para verificar el codigo
                    /*Linea 316 aca estamos llamando a la api de activacion y adicional llamanos el post de emil de la persona 
                    a la que se le envia el correo y adicional el numero de azar, al momento de dar click en activar 
                     se redirige al backend */
                    html:` <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">

    <table width="100%" style="margin: 20px 0; padding: 0;">
        <tr>
            <td align="center">
                <table width="600" style="background-color: #ffffff; border: 1px solid #dddddd; border-radius: 5px; overflow: hidden;">
                    <tr>
                        <td style="padding: 20px 0; text-align: center; background-color: #4CAF50; color: white;">
                            <h1 style="margin: 0; font-size: 24px;">Activación de Cuenta</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <p style="font-size: 16px; color: #333333;">Hola,</p>
                            <p style="font-size: 16px; color: #333333;">Gracias por registrarte. Haz clic en el siguiente botón para activar tu cuenta:</p>

                            <a href="http://localhost:4200/activar/${post.email}/${azar}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; margin: 20px 0;">Activar Cuenta</a>
                            
                            <p style="font-size: 16px; color: #333333;">O utiliza el siguiente código de activación:</p>
                            <p style="font-size: 18px; font-weight: bold; color: #4CAF50; background-color: #f9f9f9; padding: 10px; border-radius: 5px; display: inline-block;">${azar}</p>
                            
                            <p style="font-size: 14px; color: #333333; margin-top: 20px;">Si prefieres, también puedes copiar y pegar el siguiente enlace en tu navegador:</p>
                            <p style="font-size: 14px; color: #4CAF50; background-color: #f9f9f9; padding: 10px; border-radius: 5px; word-break: break-all;">
                                http://localhost:4200/activar/${post.email}/${azar}
                            </p>
                            
                            <p style="font-size: 14px; color: #666666;">Si no has solicitado esta cuenta, ignora este correo.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; text-align: center; font-size: 12px; color: #666666;">
                            &copy; 2024 GymGlam. Todos los derechos reservados.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
                           </div> `
                }   // envia correo con ciertas condiciones
                transporter.sendMail(mailOptions, (error,info) => {
                  if (error){
                    console.log(error)
                  }
                  else {
                    console.log(info)
                  }
                })


                response.json(respuesta)
            })
        }
    })


    
    
    


   


}


usuariosController.listar = function(request, response){
    usuariosModel.listar(null, function(respuesta){
        response.json(respuesta)
    })
    
    
}

usuariosController.listarId = function(request, response){
    var post = {
        _id:request.body._id
    }

    if(post._id == null || post._id == undefined || post._id == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo _id es obligatorio"})
        //frena el procesp
        return false
    }
    usuariosModel.listarId(post, function(respuesta){
        response.json(respuesta)
    })
    
    
}

usuariosController.actualizar = function (request, response){

    var post = {
        _id:request.body._id,
        nombre:request.body.nombre,
        rol:request.body.rol,
        estado:request.body.estado
    }

    if(post.nombre == null || post.nombre == undefined || post.nombre == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo nombre es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.rol == null || post.rol == undefined || post.rol == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo rol es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.estado == null || post.estado == undefined || post.estado == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo estado es obligatorio"})
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

    usuariosModel.actualizar(post, function(respuesta){
        response.json(respuesta)
    })

    
}

usuariosController.login = function(request, response){

    var post = 
    { 
        email: request.body.email,
        password: request.body.password
    }
  

    if(post.email == null || post.email == undefined || post.email == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo email es obligatorio"})
        //frena el procesp
        return false
    }

    if(post.password == null || post.password == undefined || post.password == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo password es obligatorio"})
        //frena el proceso
        return false
    }
    
    // Estamos incertando la contraseña ya encryptada
    post.password = SHA256(post.password + config.palabraclave) 

    //Validar login
    usuariosModel.validalogin(post, function (validacion){
        var tiempo = tiempoTranscurridoEnMinutos (validacion.fechalogin)
        console.log(tiempo)
        

        if(validacion.errorlogin < 3 ){
            //si se puede hacer log in
            usuariosModel.login(post,function(respuesta){
                if (respuesta.state == false){
                    post.cantidad = validacion.errorlogin + 1
                    usuariosModel.actualizarerrores(post, function(act){
                        response.json(respuesta)
                    })
                }
                else {
                    //Actualizar la fecha del ultimo logueo
                    usuariosModel.actualizarfechalogin(post, function(actfecha){

                    })
                    // Almacenamiento de datos sobre la tarjeta de roles
                    request.session.nombre = respuesta.data [0].nombre
                    request.session._id = respuesta.data [0]._id
                    request.session.ultimologin = respuesta.data [0].ultlogin
                    request.session.rol = respuesta.data [0].rol
                    
                    //Aca estamos bloqueando que la informacion no se muestre en en el array por la consola
                    response.json({state:true, mensaje:"Bienvenido: " + respuesta.data[0]. nombre})
                }
                
            })
        }
        else{ 
            //bloqueado
            if (tiempo < 2){
                response.json({state:false, mensaje: "Debe esperar al menos 2 minutos, Han Transcurrido:" + tiempo })
            } else {

                usuariosModel.login(post, function (respuesta){
                    post.cantidad =  0
                    usuariosModel.actualizarerrores(post, function(act){
                        response.json(respuesta)
                    })
                }) 
            }
        } 
    })

    
    
}

usuariosController.filtronombre = function (request, response){
    var post= {
        nombre:request.body.nombre
    }

    if(post.nombre == null || post.nombre == undefined || post.nombre == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el nombre email es obligatorio"})
        //frena el procesp
        return false
    }
    usuriosModel.filtronombre (post, function(midata){
        response.json(midata)
    })


}

usuariosController.eliminar = function (request, response){

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

    usuariosModel.eliminar(post, function(respuesta){
        response.json(respuesta)
    })

    
}

usuariosController.activar = function (request, response){

    var post = {
        //params por que es de tipo get
        email:request.body.email,
        azar:request.body.azar
    }

    if(post.email == null || post.email == undefined || post.email == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo email es obligatorio"})
        //frena el procesp
        return false
    }

    //se necesita el id ya que en este caso estomos haciendo busqueda por el id mongo

    if(post.azar == null || post.azar == undefined || post.azar == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo azar es obligatorio"})
        //frena el procesp
        return false
    }

    usuariosModel.activar(post, function(respuesta){
        response.json(respuesta)
    })

    
}

usuariosController.solicitarcodigo = function(request, response)
{
    var post = 
    { 
        email: request.body.email,
        
        
        
        
    }
  
  //Codicionales
    //Van antes del push

    
    if (post.email == null || post.email == undefined || post.email == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo email es obligatorio"})
        //frena el procesp
        return false
    }


    //rex.text nos permite confirmr si un email es valido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(regex.test(post.email) == false){
        response.json({state:false,mensaje: "el campo email no es valido"})
    }


    //guardar en el modelo(modelos) se importa
    //los callback se capturan creando funciones
    // Validacion para no gurdar emails que ya existe
     usuariosModel.existeemail(post, function(res){

        if(res.existe == 'no'){
         response.json({state:false,mensaje: "el email no existe"})
         return false
        }
        else{
            //Variable para establecer numero aleatorio 
            var codigo = 'PASS-' + Math.floor(Math.random() * (9999 - 1000) + 1000);
            //esta variable se esta usando para marcar como activo o desactivado un usuario
            post.codigo = codigo
            
            usuariosModel.guardarcodigorecuperacion(post,function(respuesta){

                const transporter = nodemailer.createTransport ({
                    // Host es el servidor de correo que vamos a utilizar (google en este caso)
                    host: config.email.host,
                    //Puerto por el que sale el correo electronico, se configura en el config
                    port:config.email.port,
                    // Tiene valor de false
                    secure:false,
                    //TLS
                    requireTLS:true,
                    //Un obeto, contiene las credenciales de acceso al usuario de Gmail, se agrega en config
                    auth:{
                      user:config.email.user,
                      pass:config.email.pass
                    }
                })
                
                //Envio de coreo de verificacion
                var mailOptions = {
                    // De donde sale el correo
                    from:config.email.user,
                    // Para quien va el correo
                    to:post.email,
                    subject: "Recuperacion de contraseña: " + codigo,
                    html:` <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333; text-align: center;">Recuperación de contraseña</h2>
        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Hola, 
        </p>
        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Has solicitado restablecer tu contraseña. Para continuar con el proceso, usa el siguiente código de recuperación:
        </p>
        <p style="text-align: center;">
            <span style="display: inline-block; background-color: #f7f7f7; border: 1px solid #ddd; padding: 10px 20px; font-size: 18px; font-weight: bold; color: #333333; letter-spacing: 2px;">
                ${codigo}
            </span>
        </p>
        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Si no solicitaste este cambio, por favor ignora este correo. Tu contraseña no se modificará hasta que uses este código en nuestra página web.
        </p>
        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Gracias,<br>
            El equipo de Soporte
        </p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="color: #999999; font-size: 12px; text-align: center;">
            Este correo fue enviado de forma automática. Por favor, no respondas a este mensaje.
        </p>
    </div>
</div>`
                }   // envia correo con ciertas condiciones
                transporter.sendMail(mailOptions, (error,info) => {
                  if (error){
                    console.log(error)
                  }
                  else {
                    console.log(info)
                  }
                })


                response.json(respuesta)
            })
        }
    })



}

usuariosController.recuperarpass = function(request, response){

    var post = 
    {   codigo: request.body.codigo,
        email: request.body.email,
        password: request.body.password,
        
        
        
    }
  
  //Codicionales
    //Van antes del push
    if(post.codigo == null || post.codigo == undefined || post.codigo == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo codigo es obligatorio"})
        //frena el procesp
        return false
    }

    
    if (post.email == null || post.email == undefined || post.email == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo email es obligatorio"})
        //frena el procesp
        return false
    }


    
    //rex.text nos permite confirmr si un email es valido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(regex.test(post.email) == false){
        response.json({state:false,mensaje: "el campo email no es valido"})
    }

    if(post.password == null || post.password == undefined || post.password == ""){
        //Si las condiciones de arriba se cumplen el resultado es el de abajo
        response.json ({state:false,mensaje:"el campo password es obligatorio"})
        //frena el proceso
        return false
    }

    post.password = SHA256(post.password + config.palabraclave)
   
    usuariosModel.recuperarpass(post, function(respuesta){
        if (respuesta.state == true){
            response.json({state:true,mensaje:"Se ha cambiado el password satisfactoriamente"})
        } 
        else {
            response.json({state:false, mensaje:"Se ha presentado un error"})
            
        }
    })
    

}



//Export
module.exports.usuariosController = usuariosController