var gestorModel = require("../models/gestorModel");


// KPI - Empregabilidade pro Area
function empregabilidadePorArea(req, res) {
    var area = req.params.area;
    gestorModel.empregabilidadePorArea(area).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum dado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os dados de empregabilidade.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


// KPI - Oferta Cursos
function ofertaCursos(req, res) {
    gestorModel.ofertaCursos().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum curso encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os cursos.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


// KPI - Periodo de maior procura
function periodoMaiorProcura(req, res) {
    const area = req.params.area;
    gestorModel.periodoMaisProcuradoPorArea(area)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum dado encontrado.");
            }
        })
        .catch((erro) => {
            console.error("Erro ao buscar período por área:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}



// GRAFICO - Salarios com maior procura

function salariosMaiorProcura(req, res) {
    gestorModel.salariosMaiorProcura().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum aluno encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os alunos.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


// GRAFICO - Salario por Area

function salarioPorArea(req, res) {
    gestorModel.salarioPorArea().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum aluno encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os alunos.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

// SELECT - Filtro pro Area

function buscarFiltroArea(req, res) {
    gestorModel.buscarFiltroArea().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum aluno encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os alunos.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    empregabilidadePorArea,
    ofertaCursos,
    periodoMaiorProcura,
    salariosMaiorProcura,
    salarioPorArea,
    buscarFiltroArea
};
