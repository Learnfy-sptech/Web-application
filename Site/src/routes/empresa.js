const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');


router.post("/cadastrarEmpresa", function (req, res){
  empresaController.cadastrarEmpresa(req, res)
});

router.post("/validarToken", function (req, res){
  empresaController.validarToken(req, res)
});

router.put("/atualizarEmpresa/:idEmpresa", function (req, res){
  empresaController.atualizarConfigurações(req, res)
});

router.get("/dadosNotificacao/:idEmpresa", function (req, res){
  empresaController.receberDadosNotificacao(req, res)
});

router.delete("/removerEmpresa", function (req, res){
  empresaController.removerEmpresa(req, res)
});

module.exports = router;