var config = {
    email:{},
    sesiones:{}


}

//User virification (smpt Gmail)
config.email.host= "smtp.gmail.com"
config.email.port= 587
config.email.user = "jardtuexplain@gmail.com"
config.email.pass = "wswsxhtpnnghmccr"

//session, secret and expiration
config.sesiones.secret = "pure"
config.sesiones.expiracion = 60000*5



//Data base name 
config.bd = "GymGlam"

//Encryption key word
config.palabraclave = "sayud2fqwyt3dfyqwfdyf3dtb5ywdf{ytqwfqwytl4fdywqtdyqwdyt4wqv"


module.exports.config = config