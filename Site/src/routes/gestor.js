var express = require("express");
var router = express.Router();
var gestorController = require("../controllers/gestorController");

// KPI - Empregabilidade pro Area
router.get("/empregabilidadePorArea/:area", function (req, res) {
    gestorController.empregabilidadePorArea(req, res);
});


// KPI - Oferta Cursos
router.get("/ofertaCursos", function (req, res) {
    gestorController.ofertaCursos(req, res);
});

// KPI - Periodo de maior procura
router.get("/periodoMaiorProcura/:area", function (req, res) {
    gestorController.periodoMaiorProcura(req, res);
});


// GRAFICO - Salarios com maior procura
router.get("/salariosMaiorProcura", function (req, res) {
    gestorController.salariosMaiorProcura(req, res);
});

// GRAFICO - Salario por Area
router.get("/salarioPorArea", function (req, res) {
    gestorController.salarioPorArea(req, res);
});

// SELECT - Filtro pro Area
router.get("/filtroArea", function (req, res) {
    gestorController.buscarFiltroArea(req, res);
});

module.exports = router;



