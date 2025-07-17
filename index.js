const express = require("express")
const exphbs = require("express-handlebars")
const mysql = require("mysql2")

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (requisicao, resposta) => {
    resposta.render('home')
})

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "todoapp"
})

conexao.connect((erro) => {
    if (erro) {
        return console.log(erro)
    }

    console.log("estou conectado ao MySQL")

    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000!")
    })
})