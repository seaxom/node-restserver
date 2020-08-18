//============================================
//Puerto
//============================================

process.env.PORT = process.env.PORT || 3000;

//============================================
//Entorno
//============================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============================================
//Vencimiento del token
//============================================
// 60 Segundos
// 60 Minutos
// 24 horas
// 30 dias

process.env.TOKEN_CADUCIDAD = 60*60*24*31;

//============================================
//Seed
//============================================

process.env.TOKEN_SEED =  process.env.TOKEN_SEED || 'este-es-el-seed-desarrollo'

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}


//============================================
//Googler client ID
//============================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '1072773762962-c9uldq8v76l14hr0ktmcv93toqvt23ig.apps.googleusercontent.com';

process.env.URLDB = urlDB;