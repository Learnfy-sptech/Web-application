var express = require("express");
var router = express.Router();
const relatorioController = require("../controllers/relatorioController");

router.post("/inserirRelatorio", function (req, res){
  relatorioController.inserirRelatorio(req, res)
});

router.get("/relatorio/obterRelatoriosPorId/:idUsuario", function (req, res) {
  relatorioController.obterRelatoriosPorId(req, res)
});

router.get("/relatorio/obterInfoRelatorio/:idRelatorio", function (req, res) {
  relatorioController.obterInfoRelatorio(req, res)
});

router.get("/relatorio/obterCidadesPorEstado/:estado", function (req, res) {
  relatorioController.obterCidadesPorEstado(req, res)
});

module.exports = router;