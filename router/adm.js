const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const {admin} = require('../helpers/admin')


router.get('/categorias', admin, (req, res) => {
    Categoria.find().sort({ data: 'desc' }).then((categorias) => {
        res.render('adm/categorias', {
            categorias: categorias
        })
    }).catch((error) => console.log(error))
})

router.get('/categorias/add', admin, (req, res) => { res.render('adm/categoriasadd') })

router.post('/categorias/nova', admin, (req, res) => {
    const nome = req.body.nome
    const slug = req.body.slug
    const error = []

    if (nome === '' || nome === null || nome === undefined) {
        error.push({ texto: 'Nome inválido' })
    }

    if (slug === '' || slug === null || slug === undefined) {
        error.push({ texto: 'Slug inválido' })
    }

    if (error.length > 0) {
        res.render('/adm/categoriasadd', { error: error })
    } else {
        const newCategoria = {
            nome: nome,
            slug: slug
        }

        new Categoria(newCategoria).save()
            .then(() => { req.flash('success_msg', 'Criado com sucesso!'), res.redirect('/adm/categorias') })
            .catch((error) => console.log('Erro ao salvar ' + error))
    }
})

router.get('/categorias/edit/:id', admin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {
        res.render('adm/edit', { categoria: categoria })
    })
        .catch((error) => console.log(error))
})

router.post('/categorias/edit', admin, (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Editado com êxito!')
            res.redirect('/adm/categorias')
        })
    }).catch((error) => console.log(error))
})

router.post('/categorias/delete', admin, (req, res) => {
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        console.log('Categoria deletada com succeso!')
        res.redirect('/adm/categorias')
    })
})

router.get('/postagem', admin, (req, res) => {
    Postagem.find().populate({ path: 'categoria', strictPopulate: false }).sort({ data: 'desc' }).then((postagens) => {
        res.render('adm/postagem', { postagens: postagens })
    }).catch((error) => {
        console.log(error)
    })
})

router.get('/postagem/add', admin, (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('adm/postagemadd', { categorias: categorias })
    }).catch((error) => {
        console.log('Houve um erro ' + error)
    })
})

router.post('/postagem/nova', admin, (req, res) => {
    const titulo = req.body.titulo
    const slug = req.body.slug
    const descricao = req.body.descricao
    const conteudo = req.body.conteudo
    const categoria = req.body.categoria

    const newPostagem = {
        titulo: titulo,
        slug: slug,
        descricao: descricao,
        conteudo: conteudo,
        categoria: categoria
    }

    new Postagem(newPostagem).save()
        .then(() => {
            console.log('Postagem criada com sucesso!')
            res.redirect('/adm/postagem')
        }).catch((error) => {
            console.log('Houve um erro ' + error)
            res.redirect('/adm/postagem')
        })
})

router.get('/postagem/edit/:id', admin, (req, res) => {
    Postagem.findOne({ _id: req.params.id }).then((postagem) => {
        Categoria.find().then((categoria) => {
            res.render('adm/postedit', { categoria: categoria, postagem: postagem })
        }).catch((error) => {
            console.log(error)
        })
    }).catch((error) => { console.log(error) })
})

router.post('/postagem/edit', admin, (req, res) => {
    Postagem.findOne({ _id: req.body.id }).then((postagem) => {
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            console.log('Editado com sucesso!')
            res.redirect('/adm/postagem')
        }).catch((error) => {
            console.log(error)
        })
    }).catch((error) => {
        console.log(error)
    })
})

router.post('/postagem/delete', admin, (req, res) => {
    Postagem.deleteOne({ _id: req.body.id }).then(() => {
        console.log('Postagem excluído com sucesso!')
        res.redirect('/adm/postagem')
    })
})

module.exports = router