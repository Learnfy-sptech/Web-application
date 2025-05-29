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
<<<<<<< HEAD
    var elementoPai = document.getElementById('info_relatorio')
    elementoPai.classList.toggle('desfoque')
    var elementoColunas = document.getElementById('todas_colunas_geral')
    elementoColunas.classList.toggle('oculto')
}

function adicionarRemoverCampo(elemento) {
    const elementoTexto = elemento.querySelector("span")
    const elementoInput = elemento.querySelector("input")
    if (elementoInput.checked == false) {
        elementoInput.checked = true
        adicionarCampoNaDiv(elementoTexto.textContent, 'campos_selecionados')
    } else {
        elementoInput.checked = false
        removerCampoNaDiv(elementoTexto.textContent)
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
        if (todasColunasSelecionadas) {
            adicionarCampoNaDiv(element.querySelector('span').textContent, 'campos_selecionados')
        } else {
            removerCampoNaDiv(element.querySelector('span').textContent)
        }
    });

    if (todasColunasSelecionadas) todasColunasSelecionadas = false
    else todasColunasSelecionadas = true
}

function adicionarCampoNaDiv(nomeColuna, idDiv) {
    const div = document.getElementById(idDiv)
    div.innerHTML += `
        <div class="campo-div-selecao" id="${nomeColuna}">
            <span>${nomeColuna}</span>
            <img src="assets/images/close_red.png" onclick="removerCampoNaDiv('${nomeColuna}')" alt="">
        </div>
    `
}

function removerCampoNaDiv(id) {
    if (id != null) {
        document.getElementById(id).remove()
    } else {
        console.log("Parâmetro errado na função 'removerCampoNaDiv(id)'")
    }
=======
    elemento = document.getElementById('todas_colunas')
    elemento.classList.toggle('oculto')
    elementoPai = document.getElementsByTagName("main")[0]
    elemento.classList.toggle('desfoque')
}

function adicionarColuna(elemento) {

}

function removerColuna(elemento) {

>>>>>>> b60375ecacc623710203cd11de39abc5ce65d0fd
}

var dadosColunasRelatorio = []
