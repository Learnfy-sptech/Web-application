var express = require("express");
var router = express.Router();
var diretorController = require("../controllers/gestorController");


// KPI - Oferta Cursos
router.get("/ofertaCursos", function (req, res) {
    diretorController.ofertaCursos(req, res);
});

// KPI - Periodo de maior procura
router.get("/periodoMaiorProcura", function (req, res) {
    diretorController.periodoMaiorProcura(req, res);
});


// GRAFICO - Salarios com maior procura
router.get("/salariosMaiorProcura", function (req, res) {
    diretorController.salariosMaiorProcura(req, res);
});

// GRAFICO - Salario por Area
router.get("/salarioPorArea", function (req, res) {
    diretorController.salarioPorArea(req, res);
});

// SELECT - Filtro pro Area
router.get("/filtroArea", function (req, res) {
    diretorController.buscarFiltroArea(req, res);
});

module.exports = router;



