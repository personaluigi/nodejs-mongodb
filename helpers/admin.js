module.exports = {
    admin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.adm == 1) {
            return next()
        } else {
            console.log('Você precisa ser um administrador')
            res.redirect('/home')
        }
    }
}