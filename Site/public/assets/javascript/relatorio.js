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
    var elementoPai = document.getElementById('info_relatorio')
    elementoPai.classList.toggle('desfoque')
    var elementoColunas = document.getElementById('todas_colunas_geral')
    elementoColunas.classList.toggle('oculto')
}

function adicionarRemoverCampo(elemento) {
    elemento_input = elemento.querySelector("input")
    if (elemento_input.checked == false) {
        elemento_input.checked = true
    } else {
        elemento_input.checked = false
    }
}

var todasColunasSelecionadas = true;
function selecionarTodasColunas() {
    const divTodasColunas = document.getElementById('todas_colunas')
    console.log(divTodasColunas)
    const opcoesColunas = divTodasColunas.querySelectorAll('.option-coluna')
    console.log(opcoesColunas)

    opcoesColunas.forEach(element => {
        element.querySelector('input').checked = todasColunasSelecionadas
    });

    if (todasColunasSelecionadas) todasColunasSelecionadas = false
    else todasColunasSelecionadas = true
}

function adicionarCampoNaDiv() {

}

function removerCampoNaDiv() {
    
}

var dadosColunasRelatorio = []
