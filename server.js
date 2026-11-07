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
    where email=$1
    `
    const result=await pool.query(query,[email])
    if(result.rowCount>0){
        const usuario=result.rows[0]
        const senhaCorreta=await bcrypt.compare(senha,usuario.senhahash)
        if(senhaCorreta){
            res.send(`
                <script>
                window.location.href='/inicio'
                </script>
                `)
        }else{
            res.send(`
                <script>
                alert("Credenciais inválidas")
                window.location.href='/'
                </script>
                `)
        }
    }else{
        res.send(`
            <script>
            alert("Credenciais inválidas")
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
        const query1=`
        SELECT * FROM usuarios
        WHERE email = $1
        `
        result=await pool.query(query1,[email])
        if(result.rowCount>0){
            res.send(`
                <script>
                alert("Usuário já cadastrado")
                window.location.href='/registro'
                </script>
                `)
        }
        
        else{
        const {nome,email,senha} = req.body
        const senhaHash= await bcrypt.hash(senha,10)
        const query2=`
        INSERT into usuarios(nome,email,senhaHash)
        VALUES($1,$2,$3)
        `
        const result2=await pool.query(query2,[nome,email,senhaHash])
        res.send(`
            <script>    
            window.location.href='/'
            </script>
            `)
        }

      
    }
})



app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})