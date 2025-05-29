function criarNovoRelatorio() {
    trocarTelaRelatorio()
}

function trocarTelaRelatorio() {

    const relatorioGeneral = document.getElementById("relatorio_general");
    const infoRelatorio = document.getElementById("info_relatorio");

    relatorioGeneral.classList.toggle("oculto");
    infoRelatorio.classList.toggle("oculto");

}

var inputPreenchido = false
function limparCampo(idElemento) {
    elemento = document.getElementById(idElemento)
    if (inputPreenchido == false) {
        inputPreenchido = true
        elemento.value = ""
    }
    elemento.focus()
}

function validarInputVazio(idElemento, texto) {
    elemento = document.getElementById(idElemento)
    if (elemento.value.length == 0) {
        elemento.value = texto
        inputPreenchido = true
    }
}

function abrirOuFecharTodasColunas() {
    elemento = document.getElementById('todas_colunas')
    elemento.classList.toggle('oculto')
    elementoPai = document.getElementsByTagName("main")[0]
    elemento.classList.toggle('desfoque')
}

function adicionarColuna(elemento) {

}

function removerColuna(elemento) {

}

var dadosColunasRelatorio = []
