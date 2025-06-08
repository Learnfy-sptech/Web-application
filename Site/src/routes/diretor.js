var express = require("express");
var router = express.Router();
var diretorController = require("../controllers/diretorController");

// KPI: Vagas por Concluintes

router.get("/vagasConcluintes", function (req, res) {
    diretorController.buscarVagasConcluintes(req, res);
});

// KPI: Taxa de Ingressantes

router.get("/totalIngressantes", function (req, res) {
    diretorController.buscarTotalIngressantes(req, res);
});

// KPI: Quantidade de Alunos de escolas privadas

router.get("/alunosEscolasPrivadas", function (req, res) {
    diretorController.buscarAlunosEscolasPrivadas(req, res);
});

// KPI: Quantidade de Alunos de escolas públicas

router.get("/alunosEscolasPublicas", function (req, res) {
    diretorController.buscarAlunosEscolasPublicas(req, res);
});

// GRAFICO : Cursos com maior Retorno (ROI)

router.get("/areaMaiorRetorno", function (req, res) {
    diretorController.buscarAreaMaiorRetorno(req, res);
});

// GRAFICO : Cota por Bolsista

router.get("/bolsistasPorArea", function (req, res) {
    diretorController.buscarBolsistaArea(req, res);
});


// SELECT : Filtro por Area

router.get("/filtroArea", function (req, res) {
    diretorController.buscarFiltroArea(req, res);
});

module.exports = router;