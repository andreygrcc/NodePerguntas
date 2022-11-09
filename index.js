const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta')

connection
    .authenticate()
    .then(()=>{
        console.log('Conexão com o banco feita com sucesso!')  
    })
    .catch((err) =>{
        console.log('Erro na conexão com banco de dados!', err)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());


app.get("/", (req, res)=>{
    Pergunta.findAll({raw: true, order: [['id', 'DESC']] }).then(perguntas =>{
        res.render('index',{
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", (req, res)=>{
    res.render('perguntar');
})

app.post("/salvarpergunta", (req,res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.pergunta;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");
    });
})

app.post("/salvarresposta", (req, res)=>{
    var perguntaId = req.body.perguntaId;
    var resposta = req.body.resposta;
    Resposta.create({
        corpo: resposta,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId)
    })
})

app.get("/pergunta/:id", (req,res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta =>{
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas =>{
                res.render('pergunta',{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else{
            res.redirect("/")
        }
    });
})

app.listen(5656,()=>{
    console.log('Servidor iniciado ;)');
});