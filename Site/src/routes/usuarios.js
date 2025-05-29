var express = require("express");
var router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const configPicture = require("../../public/assets/javascript/configPicture");

router.post("/cadastrar", function (req, res){
  usuarioController.cadastrar(req, res)
});

router.post("/login", function (req, res) {
  usuarioController.login(req, res)
});

router.post("/atualizar", configPicture.single("foto"), function (req, res) {
  usuarioController.atualizar(req, res);
});

module.exports = router;
