const localStrategy = require('passport-local').Strategy
const passport = require('passport')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('../models/User')
const Usuario = mongoose.model('usuarios')

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {
        Usuario.findOne({ email: email }).then((usuario) => {
            if (!usuario) {
                return done(null, false, { message: 'Essa conta não existe' })
            }
    
            bcrypt.compare(senha, usuario.senha, (erro, igual) => {
                if (igual) {
                    return done(null, usuario)
                } else {
                    return done(null, false, { message: 'Senha incorreta' });
                }
            })        
        })
    }))    

    passport.serializeUser((usuario, done) => {
        console.log('SerializeUser chamado. ID:', usuario.id)
        done(null, usuario.id)
    })
    

    passport.deserializeUser(function(id, done) {
        Usuario.findOne({where:{id:id}}).then((usuario) => {
            done(null, usuario)
        }).catch((err) => {
            done(err, null)
        })
      })
}