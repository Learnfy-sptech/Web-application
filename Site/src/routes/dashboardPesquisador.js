var express = require("express");
var router = express.Router();
const dashboardPesquisadorController = require("../controllers/dashboardPesquisadorController");

router.get('/getKpiQtdCursantes/:area', function (req, res){
    dashboardPesquisadorController.getKpiQtdCursantes(req, res)
});

router.post('/getKpiPessoasTrabalhamNaArea/:area', function(req, res){
    dashboardPesquisadorController.getKpiPessoasTrabalhamNaArea(req, res)
});

router.post('/getKpiEvasaoPorModalidade/:area', function(req, res){
    dashboardPesquisadorController.getKpiEvasaoPorModalidade(req, res)
});

router.post('/getKpi', function(req, res){ // esperar a luiza trocar
    dashboardPesquisadorController.getKpiMediaAlunosEscolaPrivada(req, res)
});

router.post('/getGraficoInstituicoes', function(req, res){
    dashboardPesquisadorController.getGraficoInstituicoes(req, res)
});

router.post('/getGraficoProjecaoEvasao' , function(req, res){
    dashboardPesquisadorController.getGraficoProjecaoEvasao(req, res)
});

module.exports = router;