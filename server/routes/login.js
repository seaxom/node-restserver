const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const Usuario = require("../models/usuario");
const { rest } = require("underscore");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
require("../config");

app.post("/login", (req, resp) => {
  let body = req.body;
  Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioBD) {
      return resp.status(400).json({
        ok: false,
        message: "(Usuario) o contraseña incorrectos",
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
      return resp.status(400).json({
        ok: false,
        message: "Usuario o (contraseña) incorrectos",
      });
    } else {
      let token = jwt.sign(
        {
          usuario: usuarioBD,
        },
        process.env.TOKEN_SEED,
        { expiresIn: process.env.TOKEN_CADUCIDAD }
      );

      resp.json({
        ok: true,
        usuario: usuarioBD,
        token,
      });
    }
  });
});

//Configuraciones de Google

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  console.log(payload.name);
  console.log(payload.email);
  console.log(payload.picture);

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

app.post("/google", async (req, resp) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token).catch((e) => {
    return resp.status(403).json({
      ok: false,
      err: e,
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return resp.status(400).json({
          ok: false,
          err: {
            message: "Debe de usuar su autenticacion normal",
          },
        });
      } else {
        let token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          process.env.TOKEN_SEED,
          { expiresIn: process.env.TOKEN_CADUCIDAD }
        );

        return resp.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      }
    } else {
      //si el usuario no existe en la base de datos
      let usuario = new Usuario();
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img,
      usuario.google = true;
      usuario.password = ":)";
       

      usuario.save((err, usuarioDB) => {
        if (err) {
          return resp.status(500).json({
            ok: false,
            err,
          });
        } else {
          let token = jwt.sign(
            {
              usuario: usuarioDB,
            },
            process.env.TOKEN_SEED,
            { expiresIn: process.env.TOKEN_CADUCIDAD }
          );

          return resp.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
          });
        }
      });
    }
  });
});

module.exports = app;
