var dashboardPesquisadorModel = require('../models/dashboardPesquisadorModel');

function getKpiQtdCursantes(req, res) {
    var area = req.params.area;

    dashboardPesquisadorModel.getKpiQtdCursantes(area)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar o resultado do KPI.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function getKpiPessoasTrabalhamNaArea(req, res) {
    var area = req.params.area;

    dashboardPesquisadorModel.getKpiPessoasTrabalhamNaArea(area)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar o resultado do KPI.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function getKpiEvasaoPorModalidade(req, res) {
       var area = req.params.area;

    dashboardPesquisadorModel.getKpiEvasaoPorModalidade(area)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar o resultado do KPI.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function getGraficoInstituicoes(req, res) {
    var area = req.body.area;

    dashboardPesquisadorModel.getGraficoInstituicoes(area)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar o resultado do KPI.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function getGraficoProjecaoEvasao(req, res) {
    var area = req.body.area;

    dashboardPesquisadorModel.getGraficoProjecaoEvasao(area)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar o resultado do KPI.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports ={
    getKpiQtdCursantes,
    getKpiPessoasTrabalhamNaArea,
    getKpiEvasaoPorModalidade,
    getGraficoInstituicoes,
    getGraficoProjecaoEvasao
}