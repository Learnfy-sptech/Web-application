const { SessionCredentialsFilterSensitiveLog } = require("@aws-sdk/client-s3");
const { application, json } = require("express");

function criarNovoRelatorio() {
    trocarTelaRelatorio()
}

function trocarTelaRelatorio() {
    const relatorioGeneral = document.getElementById("relatorio_general");
    const infoRelatorio = document.getElementById("info_relatorio");
    relatorioGeneral.classList.toggle("oculto");
    infoRelatorio.classList.toggle("oculto");
}

function voltarAosMeusRelatorios() {
    trocarTelaRelatorio()
    obterRelatoriosPorId()
}

var inputPreenchido = false
function limparCampo(idElemento) {
    const elemento = document.getElementById(idElemento)
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
            colunas: Array.isArray(colunas) ? colunas : [],
            filtros: typeof filtros === "object" ? filtros : {}
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            Swal.fire({
                title: "Relatório Salvo com Sucesso!",
                text: "A partir de agora ele já está disponível para ser importado :)",
                // icon: "success",
                showConfirmButton: true,
                confirmButtonColor: "#800000"
            }).then(() => {
                voltarAosMeusRelatorios();
            });
        } else {
            Swal.fire({
                title: "Não foi possível salvar o relatório",
                text: "Tente novamente ou informe a central de atendimentos",
                // icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: "#800000"
            });
        }
    })
}


function obterRelatoriosPorId() {
    const idUsuario = sessionStorage.ID_USUARIO
    fetch(`/relatorio/obterRelatoriosPorId/${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(json => {
                if (json.length == 0) {
                    document.getElementById("meus_relatorios").innerHTML = `
                        <h1 id = "sem_relatorios">Parece que você ainda não tem relatórios...
                        <a onclick="criarNovoRelatorio()">Crie agora!</a>
                        </h1>
                `
                } else {
                    construirMeusRelatorios(json)
                }

            })
        }
    })
}

function obterInfoRelatorio(elemento) {
    const idRelatorio = elemento.id
    fetch(`/relatorio/obterRelatoriosPorId/${idRelatorio}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(function (resposta) {
        if (resposta.ok) {
            Swal.fire({
                title: "Relatório Salvo com Sucesso!",
                text: "A partir de agora ele já está disponível para ser importado :)",
                // icon: "success",
                showConfirmButton: true,
                confirmButtonColor: "#800000"
            })
            obterRelatoriosPorId()
        }
    })
}

function adicionarFiltro(elemento) {
    console.log(elemento)
    switch (elemento.id) {
        case "filtro_ano":
            filtrosSelecionados.ano = elemento.value
            break;
        case "filtro_especializacao":
            filtrosSelecionados.especializacao = elemento.value
            break;
        case "filtro_estado":
            filtrosSelecionados.estado = elemento.value
            buscarCidadesPorEstado(elemento.value)
            break;
        case "filtro_cidade":
            filtrosSelecionados.cidade = elemento.value
            break;
    }
    console.log(filtrosSelecionados)
}


function construirMeusRelatorios(relatorios) {
    document.getElementById("meus_relatorios").innerHTML = ''
    relatorios.forEach((relatorio) => {
        adicionarRelatorioNaDiv(relatorio)
    })

}


function adicionarRelatorioNaDiv(infoRelatorio) {
    const divMeusRelatorios = document.getElementById('meus_relatorios')

    const idRelatorioCompleto = `relatorio_${infoRelatorio.id_relatorio}`

    divMeusRelatorios.innerHTML += `
        <div class="relatorio" id="${idRelatorioCompleto}">
            <div class="sessao-relatorio sessao-01">
                <div>
                    <p id="nome_relatorio">${infoRelatorio.nome}</p>
                </div>
                <div class="img-edit-relatorio">
                    <img src="assets/images/edit-text.png" onclick="editarRelatorio(${idRelatorioCompleto})" alt="">
                    <img src="assets/images/delete.png" onclick="deletarRelatorio(${idRelatorioCompleto})" alt="">
                </div>
            </div>
            <div class="sessao-relatorio sessao-02">
                <p>
                    Colunas:
                    <span id="colunas_relatorio">${infoRelatorio.colunas}</span>
                </p>
                <p>
                    Filtros:
                    <span id="filtro_relatorio">${infoRelatorio.filtros}</span>
                </p>
            </div>
            <div class="sessao-relatorio sessao-03">
                <p>
                    Criado em:
                    <span id="criado_relatorio">${infoRelatorio.dt_criacao}</span>
                </p>
                <button onclick="exportarRelatorio()">Exportar</button>
            </div>
        </div>
    `
}

function buscarCidadesPorEstado(estado) {
    fetch(`/relatorio/obterCidadesPorEstado/${estado}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(function (resposta) {
        if (resposta.ok) {

        }
    })
}

function deletarRelatorio(elemento) {
    const idRelatorio = elemento.id.replace("relatorio_", "")
    fetch(`/relatorio/deletarRelatorioPorId/${idRelatorio}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(function (resposta) {
        if (resposta.ok) {
            Swal.fire({
                title: "Relatório Deletedo com Sucesso!",
                text: "Mas você ainda pode gerar outros relatórios, vá em frente :)",
                // icon: "success",
                showConfirmButton: true,
                confirmButtonColor: "#800000"
            }).then(() => {
                obterRelatoriosPorId()
            })
        }
    })

}