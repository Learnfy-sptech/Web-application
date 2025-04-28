function auth(req, res, next) {
    console.log("Middleware de autenticação executado.");
    next();
}

module.exports = auth;
