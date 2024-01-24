const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema ({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    adm: {
        type: Number,
        default: 0
    }
})

mongoose.model('usuarios', Usuario)