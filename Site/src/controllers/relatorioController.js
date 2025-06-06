var model = require("../models/relatorioModel")

function inserirRelatorio(req, res) {
  const nome = req.body.nome
  const fkUsuario = req.body.fkUsuario
  const colunas = req.body.colunas
  const filtros = req.body.filtros

  console.log(`[INSERIR RELATÓRIO] Dados recebidos: ${toString(req.body)}`)

  if (fkUsuario == undefined ||
    nome == undefined ||
    colunas == undefined ||
    filtros == undefined
  ) {
    return res.status(400).send("Dados inválidos para a requisição!")
  }

  model.inserirRelatorio(nome, fkUsuario, colunas, filtros).then(function (resposta) {
    return res.json(resposta).status(200)
  })
    .catch(function (erro) {
      return res.status(500).json(erro.sqlMessage);
    });
}

function obterRelatoriosPorId(req, res) {
  const userId = req.params.idUsuario

  console.log(`[OBTER RELATÓRIOS POR ID] Dados recebidos: ${toString(req.params)}`)

  if (userId == undefined) {
    return res.status(400).send("Dados inválidos para a requisição!")
  }

  model.obterRelatoriosPorId(userId).then(function (resposta) {
    return res.json(resposta).status(200)
  })
    .catch(function (erro) {
      return res.status(500).json(erro.sqlMessage);
    });
}

function obterInfoRelatorio(req, res) {
  const idRelatorio = req.params.idRelatorio

  console.log(`[OBTER INFO RELATÓRIO] Dados recebidos: ${toString(req.params)}`)

  if (idRelatorio == undefined) {
    return res.status(400).send("Dados inválidos para a requisição!")
  }

  model.obterInfoRelatorio(userId).then(function (resposta) {
    return res.json(resposta).status(200).send('Relatórios por Id obtidos com sucesso!');
  })
    .catch(function (erro) {
      return res.status(500).json(erro.sqlMessage);
    });
}

function obterCidadesPorEstado(req, res) {
  const estado = req.params.estado

  console.log(`[OBTER CIDADE POR ESTADO] Dados recebidos: ${toString(req.params)}`)

  if (estado == undefined) {
    return res.status(400).send("Dados inválidos para a requisição!")
  }

  model.obterCidadesPorEstado(estado).then(function (resposta) {
    return res.json(resposta).status(200);
  })
    .catch(function (erro) {
      return res.status(500).json(erro.sqlMessage);
    });
}

function deletarRelatorioPorId(req, res) {

  const idRelatorio = req.params.idRelatorio

  console.log(`[DELETAR RELATÓRIO POR ID] Dados recebidos: ${toString(req.params)}`)

  if (idRelatorio == undefined) {
    return res.status(400).send("Dados inválidos para a requisição!")
  }

  model.deletarRelatorioPorId(idRelatorio).then(function (resposta) {
    return res.status(200).send("Relatório deletado com sucesso!")
  })
    .catch(function (erro) {
      return res.status(500).json(erro.sqlMessage);
    })

}

module.exports = {
  inserirRelatorio,
  obterRelatoriosPorId,
  obterInfoRelatorio,
  obterCidadesPorEstado,
  deletarRelatorioPorId
}