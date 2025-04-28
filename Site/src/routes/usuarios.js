var express = require("express");
var router = express.Router();
const authMiddleware = require('../middlewares/auth'); 
const usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res){
  usuarioController.cadastrar(req, res)
});

router.post("/login", function (req, res) {
  usuarioController.login(req, res)
});

router.use('/uploads', express.static('uploads'));

router.post('/profile/photo', authMiddleware, usuarioController.uploadProfilePhoto);

router.get('/profile/photo/:userId', usuarioController.getProfilePhoto);

module.exports = router;
