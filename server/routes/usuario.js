const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const app = express();
const Usuario = require("../models/usuario");
const { verificarToken, verificaAdmin_Role} = require('../middleware/autenticacion');

app.get("/usuario", verificarToken,  function (req, res) {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({estado:true}, "nombre email role estado google")
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      } else {
        Usuario.count({estado:true}, (err, conteo) => {
          res.json({
            ok: true,
            usuarios,
            cuantos: conteo,
          });
        });
      }
    });
});

app.post("/usuario", [verificarToken,verificaAdmin_Role], function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err,
      });
    } else {
      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  });
});

app.put("/usuario/:id", [verificarToken,verificaAdmin_Role],function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true, context: "query" },
    (err, usuarioDB) => {
      if (err) {
        res.status(400).json({
          ok: false,
          err,
        });
      } else {
        res.json({
          ok: true,
          usuario: usuarioDB,
        });
      }
    }
  );
});

app.delete("/usuario/:id", verificarToken,function (req, res) {
  let id = req.params.id;
  //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
      estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true }, (err, usuarioBorrado) => {


    if(!usuarioBorrado){
      return res.status(400).json({
        ok:false,
        err:{
          message: 'Usuario no encontrado'
        }
      });
    }

    if (err) {
      return res.status(400).json({
        ok:false,
        err
      });
    }else{
      res.json({
        ok:true,
        usuario: usuarioBorrado
      })
    }
    
  
  });
});

module.exports = app;
