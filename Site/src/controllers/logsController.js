var logsModel = require('../models/logsModel');

function receberLogs(req, res) {
    const pagina = parseInt(req.query.pagina) || 1;
    const tamanhoPagina = parseInt(req.query.tamanhoPagina) || 10;

    logsModel.listarLogs(pagina, tamanhoPagina)
        .then(resposta => {
            res.status(200).json(resposta);
        })
        .catch(erro => {
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

module.exports = {
    receberLogs
};
