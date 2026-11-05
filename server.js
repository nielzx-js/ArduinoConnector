const pool=require('./database')
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT
app.use(express.urlencoded({ extended: true }))

app.get('/',(req,res)=>{
    res.render('login')
})

app.get('/registro',(req,res)=>{
    res.render('registro')
})

app.get('/verificacao',(req,res)=>{
    res.render('verificacao')
})
app.listen(port,()=>{
    console.log(`http://localhost:${3000}`)
})