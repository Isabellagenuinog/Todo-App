const express = require("express")
const exphbs = require("express-handlebars")
const mysql = require("mysql2")
const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "todoapp"
})

conexao.connect((erro) => {
    if (erro) {
        return console.log(erro)
    } else {
        console.log("Estou conectado ao MySQL!")

        app.listen(3000, () => {
            console.log("Servidor rodando na porta 3000!")
        })
    }
})

app.get('/limparTarefas', (requisicao, resposta) => {
    const sql = 'DELETE FROM tarefas'

    conexao.query(sql, (erro) => {
        if (erro) {
            return console.log(erro)
        }

        resposta.redirect('/')
    })
})


app.post('/excluir', (requisicao, resposta) =>{
    const ID = requisicao.body.ID
    const sql = `
    DELETE FROM tarefas
    WHERE ID = ${ID}
    `

    conexao.query(sql, (erro) => {
        if (erro){
            return console.log(erro)
        }

        resposta.redirect('/')
    })
})

app.post('/completar', (requisicao, resposta) =>{
    const ID = requisicao.body.ID
    const sql = `
    UPDATE tarefas
    SET completa = 1
    WHERE ID = ${ID}
    `

    conexao.query(sql, (erro) => {
        if (erro){
            return console.log(erro)
        }

        resposta.redirect('/')
    })
})

app.post('/descompletar', (requisicao, resposta) =>{
    const ID = requisicao.body.ID
    const sql = `
    UPDATE tarefas
    SET completa = 0
    WHERE ID = ${ID}
    `

    conexao.query(sql, (erro) => {
        if (erro){
            return console.log(erro)
        }

        resposta.redirect('/')
    })
})


app.post('/criar', (requisicao, resposta) => {
    const descricao = requisicao.body.descricao
    const completa = 0

    const sql = 'INSERT INTO tarefas(descricao, completa) VALUES (?, ?)';
    const values = [descricao, completa]

    conexao.query(sql, values, (erro) => {
        if (erro) {
            return console.log(erro)
        } else {
            resposta.redirect('/')
        }
    }) 
})

app.get('/ativas', (requisicao, resposta) => {
    const sql = `
        SELECT * FROM tarefas
        WHERE completa = 0
    `

    conexao.query(sql, (erro, dados) => {
        if (erro) {
            return console.log(erro)
        }

        const tarefas = dados.map((dado) => ({
            ID: dado.ID,
            descricao: dado.descricao,
            completa: false
        }))

        const quantidadeTarefas = tarefas.length
        resposta.render('ativas', { tarefas, quantidadeTarefas })
    })
})


app.get('/completas', (requisicao, resposta) => {
    const sql = `
        SELECT * FROM tarefas
        WHERE completa = 1
    `

    conexao.query(sql, (erro, dados) => {
        if (erro) {
            return console.log(erro)
        }

        const tarefas = dados.map((dado) => ({
            ID: dado.ID,
            descricao: dado.descricao,
            completa: true
        }))

        const quantidadeTarefas = tarefas.length
        resposta.render('completas', { tarefas, quantidadeTarefas })
    })
})

app.get('/', (requisicao, resposta) => {
    const sql = 'SELECT * FROM tarefas'

    conexao.query(sql, (erro, dados) =>{
        if (erro) {
            return console.log(erro)
        }
        const tarefas = dados.map((dado) => {
            return{
                ID: dado.ID,
                descricao: dado.descricao,
                completa: dado.completa === 0? false : true
            }
        })


        const tarefasAtivas = tarefas.filter((tarefa) => {
            return tarefa.completa == false && tarefa
        })

        const quantidadeTarefasAtivas = tarefasAtivas.length


        resposta.render('home', { tarefas, quantidadeTarefasAtivas })
    })
})