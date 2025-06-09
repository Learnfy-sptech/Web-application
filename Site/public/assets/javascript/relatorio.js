var exportToExcel = require("./exportToExcel")
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
        <div class='campo-div-selecao' id='${idDivColuna}'>
            <span>${nomeColuna}</span>
            <img src="assets/images/close_red.png" onclick="removerCampoNaDiv('${idDivColuna}')" alt="">
        </div>
    `
}

function removerCampoNaDiv(id) {
    if (id != null) {
        const elemento = document.getElementById(id)
        console.log(elemento)
        elemento.parentNode.removeChild(elemento)
        var position = dadosColunasRelatorio.indexOf(id)
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

var todosSelecionados = false;
function selecionarTodos() {
    todosSelecionados = !todosSelecionados;
    console.log(todosSelecionados);
    const elementoColunas = document.getElementById('todas_colunas');
    const colunas = elementoColunas.querySelectorAll('div');

    colunas.forEach((coluna) => {
        const inputColuna = coluna.querySelector('input');
        if (inputColuna) {
            inputColuna.checked = todosSelecionados;
        }
    });
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

function atualizarRelatorio() {
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
    const idRelatorio = sessionStorage.ID_RELATORIO_ATUAL
    const colunas = dadosColunasRelatorio
    const filtros = {
        ano: anoFiltro,
        especializacao: especializacaoFiltro,
        curso: cursoFiltro,
        estado: estadoFiltro,
        cidade: cidadeFiltro
    }

    fetch("/relatorio/atualizarRelatorio", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            idRelatorio,
            colunas: Array.isArray(colunas) ? colunas : [],
            filtros: typeof filtros === "object" ? filtros : {}
        })
    }).then(resposta => {
        if (resposta.ok) {
            Swal.fire({
                title: "Relatório Editado com Sucesso!",
                text: "Não se esqueça que poderá modificá-lo novamente quando quiser :)",
                showConfirmButton: true,
                confirmButtonColor: "#800000"
            }).then(() => {
                limparCamposRelatorio()
                voltarAosMeusRelatorios()
            });
        } else {
            Swal.fire({
                title: "Não foi possível editar o relatório",
                text: "Tente novamente ou informe a central de atendimentos",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: "#800000"
            });
        }
    }).catch(err => {
        console.error("Erro ao editar relatório:", err);
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
    document.getElementById("meus_relatorios").innerHTML = `
        <h1 id="sem_relatorios">Parece que você ainda não tem relatórios...
            <a onclick="criarNovoRelatorio()">Crie agora!</a>
        </h1>
        `
}

function obterInfoRelatorio(idRelatorio) {
    fetch(`/relatorio/obterInfoRelatorio/${idRelatorio}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(resposta => {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.error("Falha ao obter info do relatório:", resposta.status);
            }
        })
        .then(json => {
            if (json && json[0]) {
                alimentarCamposRelatorio(json[0]);
            }
        })
        .catch(err => {
            console.error("Erro ao obter info do relatório:", err);
        });
}

function alimentarCamposRelatorio(json) {
    if (!json) return;

    console.log("Dados recebidos do banco:", json);

    limparCamposRelatorio();
        const elementoBotoes = document.getElementById('div_btn_salvar')
    elementoBotoes.innerHTML = `
        <button id="btn_salvar_exportar" onclick="atualizarRelatorio(); exportar()">Salvar e
            Exportar</button>
        <button id="btn_salvar" onclick="atualizarRelatorio()">
            Salvar
        </button>
    `
    const inputNome = document.getElementById('input_nome_relatorio');
    if (inputNome) {
        inputNome.value = json.nome || "";
    }

    if (Array.isArray(json.colunas)) {
        dadosColunasRelatorio = [...json.colunas];
        const div = document.getElementById('campos_selecionados')
        const elementosDiv = div.querySelectorAll('div')
        if (elementosDiv.length != 0) {
            elementosDiv.forEach((actualElement) => {
                actualElement.remove()
            })
        }
        dadosColunasRelatorio.forEach((colunaAtual) => {
            adicionarCampoNaDiv(colunaAtual)
        })
    }

    if (json.filtros) {
        if (json.filtros.ano) {
            document.getElementById('filtro_ano').value = json.filtros.ano;
            anoFiltro = json.filtros.ano;
        }

        if (json.filtros.especializacao) {
            document.getElementById('filtro_especializacao').value = json.filtros.especializacao;
            especializacaoFiltro = json.filtros.especializacao;

            buscarCursosPorEspecializacao(json.filtros.especializacao).then(() => {
                if (json.filtros.curso) {
                    document.getElementById('filtro_curso').value = json.filtros.curso;
                    cursoFiltro = json.filtros.curso;
                }
            });
        }

        // Lógica para estado e cidade (com dependência)
        if (json.filtros.estado) {
            document.getElementById('filtro_estado').value = json.filtros.estado;
            estadoFiltro = json.filtros.estado;

            // Carrega cidades e depois seleciona a correta
            buscarCidadesPorEstado(json.filtros.estado).then(() => {
                if (json.filtros.cidade) {
                    // Aguarda um breve momento para garantir que as opções foram carregadas
                    setTimeout(() => {
                        const cidadeSelect = document.getElementById('filtro_cidade');
                        if (cidadeSelect) {
                            cidadeSelect.value = json.filtros.cidade;
                            cidadeFiltro = json.filtros.cidade;
                        }
                    }, 300);
                }
            });
        }
    }
}

function buscarCidadesPorEstado(estado) {
    return new Promise((resolve, reject) => {
        if (!estado) {
            resolve();
            return;
        }

        const cidadeSelect = document.getElementById('filtro_cidade');
        cidadeSelect.disabled = true;
        cidadeSelect.innerHTML = '<option value="" selected>Carregando...</option>';

        fetch(`/relatorio/obterCidadesPorEstado/${estado}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(resposta => {
                if (!resposta.ok) throw new Error("Erro ao buscar cidades");
                return resposta.json();
            })
            .then(cidades => {
                cidadeSelect.innerHTML = '<option value="" selected>Selecione</option>';
                cidades.forEach(cidade => {
                    const option = document.createElement("option");
                    option.value = cidade.nome || cidade.id || cidade;
                    option.textContent = cidade.nome || cidade.id || cidade;
                    cidadeSelect.appendChild(option);
                });
                cidadeSelect.disabled = false;
                resolve();
            })
            .catch(err => {
                console.error("Erro ao buscar cidades:", err);
                cidadeSelect.innerHTML = '<option value="" selected>Erro ao carregar</option>';
                reject(err);
            });
    });
}

function buscarCursosPorEspecializacao(especializacao) {
    return new Promise((resolve, reject) => {
        if (!especializacao) {
            resolve();
            return;
        }

        const cursoSelect = document.getElementById('filtro_curso');
        cursoSelect.disabled = true;
        cursoSelect.innerHTML = '<option value="" selected>Carregando...</option>';

        fetch(`/relatorio/obterCursosPorEspecializacao/${especializacao}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(resposta => {
                if (!resposta.ok) throw new Error("Erro ao buscar cursos");
                return resposta.json();
            })
            .then(cursos => {
                cursoSelect.innerHTML = '<option value="" selected>Selecione</option>';
                cursos.forEach(curso => {
                    const option = document.createElement("option");
                    option.value = curso.nome || curso.id || curso;
                    option.textContent = curso.nome || curso.id || curso;
                    cursoSelect.appendChild(option);
                });
                cursoSelect.disabled = false;
                resolve();
            })
            .catch(err => {
                console.error("Erro ao buscar cursos:", err);
                cursoSelect.innerHTML = '<option value="" selected>Erro ao carregar</option>';
                reject(err);
            });
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
                <button onclick="exportarRelatorio('${infoRelatorio.id_relatorio}')">Exportar</button>
            </div>
        </div>
    `
}

function ativarSelect(id) {
    document.getElementById(id).disabled = false
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
                    title: "Relatório Deletado com Sucesso!",
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

    document.getElementById("btn_salvar_exportar").onclick = function () {
        inserirRelatorio()
        exportarRelatorio()
    }
    document.getElementById("btn_salvar").onclick = function () {
        inserirRelatorio()
    }
    dadosColunasRelatorio = []
}

function editarRelatorio(elemento) {
    trocarTelaRelatorio();

    setTimeout(() => {
        const idRelatorio = elemento.id.replace("relatorio_", "");
        sessionStorage.ID_RELATORIO_ATUAL = idRelatorio;
        obterInfoRelatorio(idRelatorio);
    }, 100)
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
    if (!filtros || Object.keys(filtros).length === 0) return "Nenhum";

    const filtrosFormatados = [];

    const entradas = Object.entries(filtros).filter(([_, valor]) => {
        if (valor === null || valor === undefined) return false;
        if (typeof valor === 'string' && valor.trim() === '') return false;
        if (Array.isArray(valor) && valor.length === 0) return false;
        return true;
    });

    if (entradas.length === 0) return "Nenhum";

    for (let i = 0; i < entradas.length; i++) {
        const [chave, valor] = entradas[i];

        const valorFormatado = String(valor).trim();
        const par = `${toCapitalize(chave)} - ${valorFormatado}`;
        const tamanhoAtual = filtrosFormatados.join(" | ").length;

        if (filtrosFormatados.length >= 4 || tamanhoAtual + par.length > 60) {
            filtrosFormatados.push("[...]");
            break;
        }
        filtrosFormatados.push(par);
    }
    return filtrosFormatados.join(" | ");
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

function exportarRelatorio(id) {
    fetch(`/relatorio/buscarDadosRelatorio/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro na requisição');
            return response.json();
        })
        .then(data => {
            console.log(data)
            return exportToExcel(data, `relatorio_${id}.xlsx`);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha ao exportar relatório: ' + error.message);
        });
}