async function carregarUsuarios() {
    const idEmpresa = sessionStorage.getItem("ID_EMPRESA");
    try {
        const resposta = await fetch(`/usuarios/empresa/${idEmpresa}`);
        const usuarios = await resposta.json();

        const tbody = document.getElementById('tabela-usuarios');
        tbody.innerHTML = '';

        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
          <td>${usuario.nome}</td>
          <td>${usuario.email}</td>
        `;

            tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error('Erro ao carregar usuários:', erro);
        Swal.fire('Erro', 'Não foi possível carregar os usuários.', 'error');
    }
}

async function carregarConfiguracaoEmpresa() {
    const idEmpresa = sessionStorage.getItem("ID_EMPRESA");

    try {
        const resposta = await fetch(`/empresa/dadosNotificacao/${idEmpresa}`); // Remover os dois-pontos ":"
        const config = await resposta.json();

        document.getElementById('notificacoesGlobais').checked = config.receber_notificacao_global;
    } catch (erro) {
        console.error('Erro ao carregar configuração:', erro);
        Swal.fire('Erro', 'Erro ao carregar configuração da empresa.', 'error');
    }
}

async function atualizarConfiguracaoNotificacao(checked) {
    const idEmpresa = sessionStorage.getItem("ID_EMPRESA");

    try {
        await fetch(`/empresa/atualizarEmpresa/${idEmpresa}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receber_notificacao_global: checked })
        });
        Swal.fire('Sucesso', 'Configuração atualizada com sucesso.', 'success');
    } catch (erro) {
        console.error('Erro ao atualizar configuração:', erro);
        Swal.fire('Erro', 'Não foi possível atualizar a configuração.', 'error');
    }
}

function salvarConfiguracao() {
    const checked = document.getElementById('notificacoesGlobais').checked;
    atualizarConfiguracaoNotificacao(checked);
}

document.addEventListener('DOMContentLoaded', () => {
    carregarUsuarios();
    carregarConfiguracaoEmpresa();

    // document.getElementById('notificacoesGlobais').addEventListener('change', (event) => {
    //     atualizarConfiguracaoNotificacao(event.target.checked);
    // });
});