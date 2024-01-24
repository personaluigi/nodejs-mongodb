const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/registro', (req, res) => {
    res.render('usuario/registro')
})

router.post('/registro', (req, res) => {
    const erros = []

    if (!req.body.username || req.body.username == null || req.body.username == undefined) {
        erros.push({ texto: 'Nome inválido' })
    }
    if (!req.body.email || req.body.email == null || req.body.email == undefined) {
        erros.push({ texto: 'Email inválido' })
    }
    if (!req.body.password || req.body.password == null || req.body.password == undefined) {
        erros.push({ texto: 'Senha inválida' })
    }
    if (req.body.password.length < 8) {
        erros.push({ texto: 'Senha muito curta' })
    }
    if (req.body.password != req.body.password2) {
        erros.push({ texto: 'Senhas diferentes!' })
    }
    if (erros.length > 0) {
        res.render('usuario/registro', { erros: erros })
    } else {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                console.log('Este email já pertence a uma conta')
                res.redirect('/user/registro')
            } else {
                const newUser = new Usuario({
                    username: req.body.username,
                    email: req.body.email,
                    senha: req.body.password
                })

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.senha, salt, (error, hash) => {
                        if (error) {
                            console.log('Houve um erro durante o salvamento de usuário')
                            res.redirect('/user/registro')
                        } else {
                            newUser.senha = hash
                            newUser.save().then(() => {
                                console.log('Usuário criado com sucesso!')
                                res.redirect('/home')
                            }).catch((error) => {
                                console.log(error)
                                res.redirect('/user/registro')
                            })
                        }
                    })
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }
})

router.get('/login', (req, res) => {
    res.render('usuario/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, (err) => {
        if (!err) {
            console.log('Usuário autenticado:', req.user.username)
        }
        next(err)
    });
})

router.get('/logout', (req, res) => {
    req.logOut((error) => {
        if (error) {
            return next(error)
        }
        console.log('Deslogado com sucesso!')
        res.redirect('/home')
    })
})

module.exports = router