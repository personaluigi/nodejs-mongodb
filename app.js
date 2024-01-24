const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const adm = require('./router/adm')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
require('./models/Categoria')
const Postagem = mongoose.model('postagens')
const Categoria = mongoose.model('categorias')
const user = require('./router/user')
const passport = require('passport')
require('./config/auth')(passport)

app.use(session({
    secret: 'undermythumtrs',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
    console.log('Middleware de res.locals chamado.')
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.usuario = req.user || null
    console.log('Usuario:', res.locals.usuario)
    next()
})


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))
app.set('view engine', 'handlebars')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://127.0.0.1/blogapp')
    .then(() => console.log('Conectado!'))
    .catch((error) => console.log('Erro ao se conectar' + error))

app.use('/adm', adm)
app.use('/user', user)

app.get('/home', (req, res) => {
    Postagem.find().populate('categoria').sort({ data: 'desc' }).then((postagens) => {
        res.render('index', { postagens: postagens })
    }).catch((error) => { console.log(error) })
})

app.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).then((postagem) => {
        if (postagem) {
            res.render('postagem/index', { postagem: postagem })
        } else {
            console.log('Erro de postagem')
            res.redirect('/home')
        }
    }).catch((error) => {
        console.log(error)
    })
})

app.get('/categorias', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('categoria/categoria', { categorias: categorias })
    }).catch((error) => {
        console.log(error)
    })
})

app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).then((categoria) => {
        if (categoria) {
            Postagem.find({ categoria: categoria._id }).then((postagem) => {
                res.render('categoria/postagens', {postagem: postagem, categoria: categoria})
            })
        } else {
            alert('Essa categoria está vazia!')
        }
    }).catch((error) => {
        console.log(error)
    })
})

const local = 8581
app.listen(local, () => {
    console.log('Servidor ligado!')
})