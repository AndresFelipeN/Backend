//Mongo conection
const mongoose = require('mongoose')
//Config
global.config = require ('./config.js').config
//Cors
const cors = require ("cors")


//Express Imports
const express = require("express")
//Express session
const session = require('express-session')
//Cookies
const cookieParser = require ('cookie-parser')

// Captures and save within the var root 
global.path = require ('path')
//Root
global.AppRoot = path.resolve(__dirname)
//paquete json to Exel se instala en el  cmd  npm i json2xls
global.json2xls = require ('json2xls') 
//libreria FS file system 
global.fs = require ('fs') 


//Exporting express to js archives
global.app = express() 
//Bodyparser
var bodyParser = require("body-parser")
const { config } = require('./config.js')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
var usuarios = []
global.SHA256  = require('sha256') //Variante global para encryptar

//Interceptor
app.all('*',function(req, res, next){

    var whitelist = req.headers.origin;
    console.log(whitelist)
    res.header('Access-Control-Allow-Origin', whitelist);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');  
    res.header('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    //Interceptors
    res.header("Access-Control-Allow-Credentials", "true");
  
    next();
      
});

//Mongo
mongoose.connect("mongodb://127.0.0.1:27017/" + config.bd).then((respuesta)=>{
    //console.log(respuesta)
    console.log("conexion correcta a mongo")
    //captura de error

}).catch((error)=> {
    console.log(error)
})

//Cors config
app.use(cors({
    origin: function(origin,callback){
       console.log(origin)
       if (!origin) return callback (null,true)
           //indexOf Es un elemento que se usa para buscar elementos dentro de un array 
           // con el indexOf hacemos una busqueda del origen que se esta tratando de conectar en mi backend
           //basicaamente determinamos quien puede entrar al backend 
           if (config.origins.indexOf(origin) == -1){
               return callback("error cors sin permisos", false)
   
           } else {
               return callback (null, true)
           }
           
   
    }
}))

//Session/Cookie config
app.use(cookieParser())                       
app.use(session({
    secret:config.sesiones.secret, 
    resave:true, //guarda la sesion si no se ha modificado
    saveUninitialized:true,// guarde la sesion asi no se haya iniciado 
    cookie:{
        //Tambien se puede configurar el tiempo desde el config conmaxAge.sessiones.expiracion
        maxAge:config.sesiones.expiracion, httpOnly:true,// el tiempo por el que va estar activo una sesion  

    },
    name: "CookieApp",//CokieApp // nombre del archivo que se descarga desde el backend hasta el frontend
    rolling:true
}))

//App.js linked to rutas.js
require ('./rutas.js')

// Acessing the upload archived 
app.use('/productos',express.static(__dirname + '/productos'))
app.use('/Avatar',express.static(__dirname + '/Avatar'))

//Exposure  the folder so that it can be visiblefor peticions from the FRONT to the BACK
app.use('/',express.static(__dirname + '/web'))

//Listening port 3000
app.listen(3000, function(){
    console.log("servidor funcionando por el puerto 3000")
})