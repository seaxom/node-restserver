require('./config');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();



app.use (bodyParser.urlencoded({extended:false}));
app.use (bodyParser.json());

app.use(require('./routes/usuario'));

 
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