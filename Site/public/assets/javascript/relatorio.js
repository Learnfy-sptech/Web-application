
var anoFiltro = ""
var especializacaoFiltro = ""
var cursoFiltro = ""
var estadoFiltro = ""
var cidadeFiltro = ""
var dadosColunasRelatorio = []


function criarNovoRelatorio() {
    trocarTelaRelatorio()
}

function trocarTelaRelatorio() {
    const relatorioGeneral = document.getElementById("relatorio_general")
    const infoRelatorio = document.getElementById("info_relatorio")
    relatorioGeneral.classList.toggle("oculto")
    infoRelatorio.classList.toggle("oculto")
}

function voltarAosMeusRelatorios() {
    trocarTelaRelatorio()
    obterRelatoriosPorId()
}

// Funções para inputs
var inputPreenchido = false
function limparCampo(idElemento) {
    const elemento = document.getElementById(idElemento)
    if (!elemento) return
    if (elemento.value === "Nome do Relatório") {
        elemento.value = ""
    }
    elemento.focus()
}

function validarInputVazio(idElemento, texto) {
    const elemento = document.getElementById(idElemento)
    if (!elemento) return
    if (elemento.value.trim().length == 0) {
        elemento.value = texto
        inputPreenchido = true
    }
}

// Funções para colunas
function abrirOuFecharTodasColunas() {
    const elementoPai = document.getElementById('info_relatorio')
    elementoPai.classList.toggle('desfoque')
    const elementoColunas = document.getElementById('todas_colunas_geral')
    elementoColunas.classList.toggle('oculto')
}

function adicionarRemoverCampo(elemento) {
    const elementoInput = elemento.querySelector('input')
    if (elementoInput) {
        elementoInput.checked = !elementoInput.checked
    }
}

function preencherCamposEscolhidos() {
    const div = document.getElementById('campos_selecionados')
    while (div.firstChild) {
        div.removeChild(div.firstChild)
    }

    alimentarLista()

    dadosColunasRelatorio.forEach((colunaAtual) => {
        adicionarCampoNaDiv(colunaAtual)
    })
}

function adicionarCampoNaDiv(idDivColuna) {
    let nomeColuna = idDivColuna.replaceAll("_", " ")
    nomeColuna = toCapitalize(nomeColuna)
    const div = document.getElementById('campos_selecionados')
    div.insertAdjacentHTML('beforeend', `
        <div class="campo-div-selecao" id="${idDivColuna}">
            <span>${nomeColuna}</span>
            <img src="assets/images/close_red.png" onclick="removerCampoNaDiv('${idDivColuna}')" alt="Remover campo">
        </div>
    `)
}

function removerCampoNaDiv(id) {
    if (id) {
        const elemento = document.getElementById(id)
        if (elemento) {
            elemento.remove()
        }
        const position = dadosColunasRelatorio.indexOf(id)
        if (position !== -1) {
            dadosColunasRelatorio.splice(position, 1)
        }
        console.log(dadosColunasRelatorio)
    } else {
        console.warn("Parâmetro inválido em removerCampoNaDiv(id)")
    }
}

function verificarCamposPreenchidos() {
    const elementoColunas = document.getElementById('todas_colunas')
    if (!elementoColunas) return

    const colunas = elementoColunas.querySelectorAll('div')

    colunas.forEach((coluna) => {
        const inputColuna = coluna.querySelector('input')
        const textoSpan = coluna.querySelector('span')
        if (!inputColuna || !textoSpan) return

        const conteudoTextoColuna = textoSpan.textContent.replaceAll(" ", "_").toLowerCase()
        inputColuna.checked = dadosColunasRelatorio.includes(conteudoTextoColuna)
    })
}

var todosSelecionados = false
function selecionarTodos() {
    todosSelecionados = !todosSelecionados
    console.log("Selecionar todos:", todosSelecionados)

    const elementoColunas = document.getElementById('todas_colunas')
    if (!elementoColunas) return

    const colunas = elementoColunas.querySelectorAll('div')

    colunas.forEach((coluna) => {
        const inputColuna = coluna.querySelector('input')
        if (inputColuna) {
            inputColuna.checked = todosSelecionados
        }
    })
}

function alimentarLista() {
    const elementoColunas = document.getElementById('todas_colunas')
    if (!elementoColunas) return

    const colunas = elementoColunas.querySelectorAll('div')
    dadosColunasRelatorio = []

    colunas.forEach((coluna) => {
        const inputColuna = coluna.querySelector('input')
        const spanColuna = coluna.querySelector('span')
        if (!inputColuna || !spanColuna) return

        const conteudoColunaId = spanColuna.textContent.replaceAll(" ", "_").toLowerCase()
        if (inputColuna.checked) {
            dadosColunasRelatorio.push(conteudoColunaId)
        }
    })
}

function toCapitalize(string) {
    if (!string) return ""
    return string.charAt(0).toUpperCase() + string.slice(1)
}

// Rotas
function inserirRelatorio() {
    const nome = document.getElementById('input_nome_relatorio').value.trim()
    if (nome === "" || nome === "Nome do Relatório") {
        Swal.fire({
            title: "Nome inválido",
            text: "Por favor, insira um nome válido para o relatório.",
            icon: "warning",
            confirmButtonColor: "#800000"
        })
        return
    }

    if (dadosColunasRelatorio.length == 0) {
        Swal.fire({
            title: "Selecione as colunas",
            text: "Por favor, selecione as colunas que farão parte do seu relatório.",
            icon: "warning",
            confirmButtonColor: "#800000"
        })
        return
    }

    const fkUsuario = sessionStorage.ID_USUARIO
    const colunas = dadosColunasRelatorio
    const filtros = {
        ano: anoFiltro,
        especializacao: especializacaoFiltro,
        curso: cursoFiltro,
        estado: estadoFiltro,
        cidade: cidadeFiltro
    }

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
    }).then(resposta => {
        if (resposta.ok) {
            Swal.fire({
                title: "Relatório Salvo com Sucesso!",
                text: "A partir de agora ele já está disponível para ser importado :)",
                showConfirmButton: true,
                confirmButtonColor: "#800000"
            }).then(() => {
                limparCamposRelatorio()
                voltarAosMeusRelatorios()
            });
        } else {
            Swal.fire({
                title: "Não foi possível salvar o relatório",
                text: "Tente novamente ou informe a central de atendimentos",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: "#800000"
            });
        }
    }).catch(err => {
        console.error("Erro ao inserir relatório:", err);
        Swal.fire({
            title: "Erro de rede",
            text: "Não foi possível conectar ao servidor.",
            icon: "error",
            confirmButtonColor: "#800000"
        });
    });
}

function obterRelatoriosPorId() {
    const idUsuario = sessionStorage.ID_USUARIO;
    fetch(`/relatorio/obterRelatoriosPorId/${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                if (!json || json.length === 0) {
                    exibirMensagemSemRelatorios();
                } else {
                    construirMeusRelatorios(json);
                }
            });
        } else {
            console.error("Falha ao obter relatórios: ", resposta.status);
        }
    }).catch(err => {
        console.error("Erro ao obter relatórios:", err);
    });
}

function exibirMensagemSemRelatorios() {
    const div = document.getElementById("meus_relatorios");
    if (div) {
        div.innerHTML = `
            <h1 id="sem_relatorios">Parece que você ainda não tem relatórios...
            <a href="javascript:void(0)" onclick="criarNovoRelatorio()">Crie agora!</a>
            </h1>
        `;
    }
}

function obterInfoRelatorio(idRelatorio) {
    fetch(`/relatorio/obterInfoRelatorio/${idRelatorio}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                if (json && json[0]) {
                    alimentarCamposRelatorio(json[0]);
                }
            });
        } else {
            console.error("Falha ao obter info do relatório:", resposta.status);
        }
    }).catch(err => {
        console.error("Erro ao obter info do relatório:", err);
    });
}

function alimentarCamposRelatorio(json) {
    if (!json) return;
    const colunas = json.colunas || []
    dadosColunasRelatorio = []
    colunas.forEach(coluna => {
        dadosColunasRelatorio.push(coluna)
    });
    preencherCamposEscolhidos();

    const inputNome = document.getElementById('input_nome_relatorio')
    if (inputNome) inputNome.value = json.nome || ""

    const filtrosJson = json.filtros
    if (!filtrosJson) return

    Object.entries(filtrosJson).forEach(([chave, valor]) => {
        const elemento = document.getElementById(`filtro_${chave}`)
        if (elemento) {
            elemento.value = valor
        }
    });
}

function adicionarFiltro(elemento) {
    if (!elemento || !elemento.value) return

    switch (elemento.id) {
        case "filtro_ano":
            anoFiltro = elemento.value
            break
        case "filtro_especializacao":
            especializacaoFiltro = elemento.value
            buscarCursosPorEspecializacao(elemento.value)
            break
        case "filtro_curso":
            cursoFiltro = elemento.value
            break
        case "filtro_estado":
            estadoFiltro = elemento.value
            buscarCidadesPorEstado(elemento.value)
            break
        case "filtro_cidade":
            cidadeFiltro = elemento.value
            break
    }
}

function construirMeusRelatorios(relatorios) {
    const div = document.getElementById("meus_relatorios")
    if (!div) return

    div.innerHTML = ""
    relatorios.forEach((relatorio) => {
        adicionarRelatorioNaDiv(relatorio)
    })
}

function adicionarRelatorioNaDiv(infoRelatorio) {
    if (!infoRelatorio || !infoRelatorio.id_relatorio) return
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
                    <span id="colunas_relatorio">${formatarColunas(infoRelatorio.colunas)}</span>
                </p>
                <p>
                    Criado em:
                    <span id="criado_relatorio">${formatarData(infoRelatorio.dt_criacao)}</span>
                </p>
            </div>
            <div class="sessao-relatorio sessao-03">
                <p>
                    Filtros:
                    <span id="filtro_relatorio">${formatarFiltros(infoRelatorio.filtros)}</span>
                </p>
                <button onclick="exportarRelatorio()">Exportar</button>
            </div>
        </div>
    `
}

function ativarSelect(id) {
    document.getElementById(id).disabled = false
}

function buscarCidadesPorEstado(estado) {
    fetch(`/relatorio/obterCidadesPorEstado/${estado}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(function (resposta) {
        if (resposta.ok) {
            const id = 'filtro_cidade'
            ativarSelect(id)
            const elemento = document.getElementById(id)
            elemento.innerHTML = '<option value="" selected hidden>Selecione</option>'
            resposta.json().then(json => {
                console.log(json)
                json.forEach(valor => {
                    const option = document.createElement("option")
                    option.value = valor.nome
                    option.textContent = valor.nome
                    elemento.appendChild(option)
                })
            })
        }
    })
}

function buscarCursosPorEspecializacao(especializacao) {
    fetch(`/relatorio/obterCursosPorEspecializacao/${especializacao}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(function (resposta) {
        if (resposta.ok) {
            const id = 'filtro_curso'
            ativarSelect(id)
            const elemento = document.getElementById(id)
            elemento.innerHTML = '<option value="" selected hidden>Selecione</option>'
            resposta.json().then(json => {
                console.log(json)
                json.forEach(valor => {
                    const option = document.createElement("option")
                    option.value = valor.nome
                    option.textContent = valor.nome
                    elemento.appendChild(option)
                })
            })
        }
    })
}

function deletarRelatorio(elemento) {
    Swal.fire({
        title: "Tem certeza?",
        text: "Essa ação não pode ser desfeita!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#800000",
        cancelButtonColor: "#d2d2d2",
        confirmButtonText: "Sim, confirmar!",
        cancelButtonText: "Cancelar"
    }).then(resposta => {
        if (resposta.isConfirmed) {
            const idRelatorio = elemento.id.replace("relatorio_", "")
            fetch(`/relatorio/deletarRelatorioPorId/${idRelatorio}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            }).then(function (resposta) {
                Swal.fire({
                    title: "Relatório Deletedo com Sucesso!",
                    text: "Mas você ainda pode gerar outros relatórios, vá em frente :)",
                    showConfirmButton: true,
                    confirmButtonColor: "#800000"
                }).then(() => {
                    obterRelatoriosPorId()
                })
            })
        }
    })
}


function limparCamposRelatorio() {
    document.getElementById('campos_selecionados').innerHTML = ''
    document.getElementById('input_nome_relatorio').value = 'Nome do Relatório'
    const filtros = document.querySelectorAll('.filtro')
    filtros.forEach((actualFilter) => {
        const select = actualFilter.querySelector('select')
        select.options[0].selected = true
    })
}

function editarRelatorio(elemento) {
    trocarTelaRelatorio()
    const idRelatorio = elemento.id.replace("relatorio_", "")
    obterInfoRelatorio(idRelatorio)
}

function formatarColunas(colunas) {
    const colunasFormatadas = []

    for (let coluna of colunas) {
        const lengthTotal = colunasFormatadas.join(", ").length

        if (colunasFormatadas.length >= 4 || lengthTotal >= 50) {
            colunasFormatadas.push("[...]")
            break
        }
        colunasFormatadas.push(' ' + toCapitalize(coluna.replaceAll('_', ' ')))
    }
    return colunasFormatadas
}

function formatarFiltros(filtros) {
    if (!filtros || Object.keys(filtros).length === 0) return "Nenhum"

    const filtrosFormatados = []
    const entradas = Object.entries(filtros)

    for (let i = 0; i < entradas.length; i++) {
        const [chave, valor] = entradas[i]
        const par = `${toCapitalize(chave)} - ${valor}`
        const tamanhoAtual = filtrosFormatados.join(" | ").length

        if (filtrosFormatados.length >= 4 || tamanhoAtual + par.length > 60) {
            filtrosFormatados.push("[...]")
            break
        }
        filtrosFormatados.push(par)
    }

    return filtrosFormatados.join(" | ")
}


function formatarData(dataString) {
    const data = new Date(dataString)

    const dia = data.getDate().toString().padStart(2, '0')
    const mes = (data.getMonth() + 1).toString().padStart(2, '0')
    const ano = data.getFullYear()

    const horas = data.getHours().toString().padStart(2, '0')
    const minutos = data.getMinutes().toString().padStart(2, '0')

    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`
}