require('./config');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');



app.use (bodyParser.urlencoded({extended:false}));
app.use (bodyParser.json());

//Configuracion global de rutas
app.use(require('./routes/index'));


app.use(express.static(path.resolve(__dirname,  './public/')));

mongoose.connect(process.env.URLDB, 
{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
(err, res) => {
  if(err){
    throw err;
  }else{
    
    console.log("Base de datos online");
  }
})

app.listen(process.env.PORT,() =>{
  console.log(`Escuchando el puerto ${process.env.PORT}`)

});