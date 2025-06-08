var express = require("express");
var router = express.Router();
const dashboardPesquisadorController = require("../controllers/dashboardPesquisadorController");

router.get('/getKpiQtdCursantes/:area', function (req, res){
    dashboardPesquisadorController.getKpiQtdCursantes(req, res)
});

router.get('/getKpiPessoasTrabalhamNaArea/:area', function(req, res){
    dashboardPesquisadorController.getKpiPessoasTrabalhamNaArea(req, res)
});

router.get('/getKpiEvasaoPorModalidade/:area', function(req, res){
    dashboardPesquisadorController.getKpiEvasaoPorModalidade(req, res)
});

router.get('/getKpiMediaSalarial/:area', function(req, res){ // esperar a luiza trocar
    dashboardPesquisadorController.getKpiMediaSalarial(req, res)
});

router.get('/getGraficoInstituicoes', function(req, res){
    dashboardPesquisadorController.getGraficoInstituicoes(req, res)
});

router.get('/getGraficoProjecaoEvasao' , function(req, res){
    dashboardPesquisadorController.getGraficoProjecaoEvasao(req, res)
});

module.exports = router;