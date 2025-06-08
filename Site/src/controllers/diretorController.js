var diretorModel = require("../models/diretorModel");

// KPI: Vagas por Concluintes


function buscarVagasConcluintes(req, res) {
    diretorModel.buscarVagasConcluintes().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhuma vaga encontrada!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as vagas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

// KPI: Taxa de Ingressantes

function buscarTotalIngressantes(req, res) {
    diretorModel.totalIngressantes().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhuma taxa encontrada!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as taxas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}



// KPI: Quantidade de Alunos de escolas privadas

function buscarAlunosEscolasPrivadas(req, res) {
    diretorModel.buscarAlunosEscolasPrivadas().then(function (resultado) {
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

// KPI: Quantidade de Alunos de escolas públicas

function buscarAlunosEscolasPublicas(req, res) {
    diretorModel.buscarAlunosEscolasPublicas().then(function (resultado) {    
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

// GRAFICO : Area com maior Retorno (ROI)

function buscarAreaMaiorRetorno(req, res) {
    diretorModel.buscarAreaMaiorRetorno().then(function (resultado) {
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

// GRAFICO : Cota por Bolsista

function buscarBolsistaArea(req, res) {
    diretorModel.buscarBolsistaArea().then(function (resultado) {
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
    diretorModel.buscarFiltroArea().then(function (resultado) {
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
    buscarVagasConcluintes,
    buscarTotalIngressantes,
    buscarAlunosEscolasPrivadas,
    buscarAlunosEscolasPublicas,
    buscarAreaMaiorRetorno,
    buscarBolsistaArea,
    buscarFiltroArea
};
