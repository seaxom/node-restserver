const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require("../models/usuario");
const { rest } = require("underscore");



app.post('/login', (req, resp) =>{


    let body = req.body;
    Usuario.findOne({email:body.email}, (err, usuarioBD) =>{

        if(err){
            return resp.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioBD){
            return resp.status(400).json({
                ok:false,
                message: '(Usuario) o contraseña incorrectos'
            })
        }

        if(!bcrypt.compareSync(body.password, usuarioBD.password)){

            return resp.status(400).json({
                ok:false,
                message: 'Usuario o (contraseña) incorrectos'
            })

        }else{

            let token = jwt.sign({
                usuario:usuarioBD
            }, process.env.TOKEN_SEED, {expiresIn: process.env.TOKEN_CADUCIDAD});
            
            resp.json({
                ok:true,
                usuario: usuarioBD,
                token
            })
        }

       

    });

})


module.exports = app;
