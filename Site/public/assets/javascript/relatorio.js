function criarNovoRelatorio() {
    trocarTelaRelatorio()
}

function trocarTelaRelatorio() {

    const relatorioGeneral = document.getElementById("relatorio_general");
    const infoRelatorio = document.getElementById("info_relatorio");

    relatorioGeneral.classList.toggle("oculto");
    infoRelatorio.classList.toggle("oculto");

}