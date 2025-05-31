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
    const elemento = document.getElementById(idElemento)
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
    const elementoInput = elemento.querySelector('input')
    const elementoSpan = elemento.querySelector('span')
    if (elementoInput.checked == false) {
        elementoInput.checked = true
    } else {
        elementoInput.checked = false
    }
}

function preencherCamposEscolhidos() {
    const div = document.getElementById('campos_selecionados')
    const elementosDiv = div.querySelectorAll('div')
    if (elementosDiv.length != 0) {
        elementosDiv.forEach((actualElement) => {
            actualElement.remove()
        })
    }

    alimentarLista()
    dadosColunasRelatorio.forEach((colunaAtual) => {
        adicionarCampoNaDiv(colunaAtual)
    })
}

function adicionarCampoNaDiv(idDivColuna) {
    var nomeColuna = idDivColuna.replaceAll("_", " ")
    nomeColuna = toCapitalize(nomeColuna)
    const div = document.getElementById('campos_selecionados')
    div.innerHTML += `
        <div class="campo-div-selecao" id="${idDivColuna}">
            <span>${nomeColuna}</span>
            <img src="assets/images/close_red.png" onclick="removerCampoNaDiv('${idDivColuna}')" alt="">
        </div>
    `
}

function removerCampoNaDiv(id) {
    if (id != null) {
        document.getElementById(id).remove()
        const position = dadosColunasRelatorio.indexOf(id)
        dadosColunasRelatorio.splice(position, 1)
        console.log(dadosColunasRelatorio)
    } else {
        console.log("Parâmetro errado na função 'removerCampoNaDiv(id)'")
    }
}

function verificarCamposPreenchidos() {
    const elementoColunas = document.getElementById('todas_colunas')
    const colunas = elementoColunas.querySelectorAll('div')

    colunas.forEach((coluna) => {
        inputColuna = coluna.querySelector('input')
        conteudoTextoColuna = coluna.querySelector('span').textContent.replaceAll(" ", "_").toLowerCase()
        if (dadosColunasRelatorio.indexOf(conteudoTextoColuna) != -1) {
            inputColuna.checked = true
        } else {
            inputColuna.checked = false
        }
    })
}

var todosSelecionados = false
function selecionarTodos() {
    if (todosSelecionados == false) {
        todosSelecionados = true
    } else {
        todosSelecionados = false
    }
    const elementoColunas = document.getElementById('todas_colunas')
    const colunas = elementoColunas.querySelectorAll('div')
    colunas.forEach((coluna) => {
        inputColuna = coluna.querySelector('input')
        inputColuna.checked = todosSelecionados
    })
}

function alimentarLista() {
    const elementoColunas = document.getElementById('todas_colunas')
    const colunas = elementoColunas.querySelectorAll('div')
    dadosColunasRelatorio = []
    colunas.forEach((coluna) => {
        inputColuna = coluna.querySelector('input')
        conteudoColunaId = coluna.querySelector('span').textContent.replaceAll(" ", "_").toLowerCase()
        if (inputColuna.checked) {
            dadosColunasRelatorio.push(conteudoColunaId)
        }
    })
}

function toCapitalize(string) {
    return string[0].toUpperCase() + string.slice(1)
}

var dadosColunasRelatorio = []
var filtrosSelecionados = {}


// Rotas
function inserirRelatorio() {
    const nome = document.getElementById('input_nome_relatorio').value
    const fkUsuario = sessionStorage.ID_USUARIO
    const colunas = dadosColunasRelatorio
    const filtros = filtrosSelecionados

    fetch("/relatorio/inserirRelatorio", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            fkUsuario,
            colunas,
            filtros
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            Swal.fire({
                title: "Relatório Salvo com Sucesso!",
                text: "A partir de agora ele já está disponível para ser importado :)",
                icon: "success",
                showConfirmButton: false,
                timer: 2000
            })
            setTimeout(function () {
                window.location("relatorio.html")
            }, 2000);
        }
    })
}

function obterTodosRelatorios() {

}

function obterInfoRelatorio() {
    
}