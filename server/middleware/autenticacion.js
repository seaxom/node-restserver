const jwt = require ('jsonwebtoken');
const { isArguments } = require('underscore');

let verificarToken = (req, res, next) =>{

    let token = req.get('token');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) =>{
        if(err){
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'token no valido'
                }
            })
        }else{
            req.usuario = decoded.usuario;
            next();
        }

        
    })

};


let verificaAdmin_Role = (req, res, next) =>{

    let usuario = req.usuario;

    if(usuario.role !== 'ADMIN_ROLE'){
        
        res.json({
            ok:false,
            err:{
                message: 'El usuario no es administrador'
            }
        });
    }else{
        next();
    }

    
}


module.exports = {
    verificarToken,
    verificaAdmin_Role
}