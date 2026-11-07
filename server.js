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
const bcrypt=require('bcrypt')


app.get('/',(req,res)=>{
    res.render('login')
})

app.get('/registro',(req,res)=>{
    res.render('registro')
})

app.get('/verificacao',(req,res)=>{
    res.render('verificacao')
})

//login
app.post('/login', async (req,res)=>{
    const {email,senha} = req.body
    const query=`
    SELECT * FROM usuarios
    WHERE email = $1
    AND
    senha = $2
    `
    const result = await pool.query(query,[email,senha])
    if (result.rowCount>0){
        res.send(`
            <script>
                window.location.href='/inicio'
            </script>
            `)
    }
    else{
        res.send(`
            <script>
            alert("Credenciais inválidas")
            window.location.href='/'
            </script>
            `)
    }
})

//registro

app.post("/registro", async (req,res)=>{
    const{senha,confirmarSenha}=req.body
    if(senha !== confirmarSenha){
        res.send(`
            <script>
            alert("as senhas não coincidem")
            window.location.href='/registro'
            </script>
            `)
    }
    else{
        const {nome,email,senha} = req.body
        const senhaHash= await bcrypt.hash(senha,10)
        const query1=`
        INSERT into usuarios(nome,email,senha)
        VALUES($1,$2,$3)
        `
        const result=await pool.query(query1[nome,email,senhaHash])
        if(result.rowCount>0){
            res.send(`
                <script>
                alert("registro feito com sucesso")
                window.location.href='/'
                <script>
                `)
        }
    }
})


app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})