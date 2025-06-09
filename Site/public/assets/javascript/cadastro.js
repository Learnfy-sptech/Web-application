// Caso usuário não possua nenhum token
let tokenInformado = null;

// Referências aos elementos de erro para mensagens
const cardErro = document.getElementById("cardErro");
const msgErro = document.getElementById("msgErro");

// Função para mostrar e depois sumir com a mensagem de erro
function sumirMensagem() {
  cardErro.style.display = "none";
  msgErro.innerText = "";
}

// Função padrão de retorno JSON de API 
async function postJSON(url, body) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const respostaTexto = await res.text();
    let respostaJson;

    try {
      respostaJson = JSON.parse(respostaTexto);
    } catch (e) {
      respostaJson = { message: respostaTexto };
    }

    if (!res.ok) {
      console.error("[postJSON] Erro HTTP:", res.status, respostaJson);
      throw new Error(respostaJson.message || "Erro ao conectar com o servidor.");
    }

    return respostaJson;
  } catch (err) {
    console.error("[postJSON] Erro na requisição:", err);
    throw err;
  }
}

// Função para abrir modal e pedir token
function abrirModalToken() {
  Swal.fire({
    title: 'Ja é credenciado?',
    text: 'Informe o token fornecido pela empresa:',
    input: 'text',
    inputPlaceholder: 'Ex: 123ABC',
    showCancelButton: true,
    confirmButtonText: 'Vincular'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const token = result.value?.trim();
      const valido = await validarToken(token);
      if (valido) {
        tokenInformado = token;
        proximaEtapa(1);
      }
    }
  });
}

// Função de cadastro da empresa
async function cadastrarEmpresa() {
  const nomeResponsavel = document.getElementById("nome_completo").value;
  const nomeEmpresa = document.getElementById("nome_empresa").value;
  const cnpj = document.getElementById("cnpj").value;
  const emailEmpresa = document.getElementById("email_empresa").value;
  const telefoneEmpresa = document.getElementById("telefone_empresa").value;

  const empresaPayload = {
    nomeResponsavel,
    nomeEmpresa,
    cnpj,
    emailEmpresa,
    telefoneEmpresa
  };

  try {
    const resposta = await postJSON("/empresa/cadastrarEmpresa", empresaPayload);
    const empresa = resposta.empresa;
    const token = empresa.token_acesso;

    console.log("[FRONT] Empresa criada com sucesso:", empresa);

    try {
      await enviarFormularioUsuario(token);

      Swal.fire({
        title: "Token de convite gerado",
        html: `
          <p><strong>SALVE O TOKEN A SEGUIR PARA CADASTRO DE SEUS FUNCIONÁRIOS!</strong></p>
          <p><strong>Token de acesso:</strong><br><code>${token}</code></p>
        `,
        icon: "success",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#800000",
      }).then(() => {
        window.location.href = "/login.html";
      });

    } catch (erroUsuario) {
      console.error("[FRONT] Erro ao cadastrar usuário:", erroUsuario);

      try {
        const respostaRemocao = await fetch("/empresa/removerEmpresa", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cnpj }),
        });

        if (!respostaRemocao.ok) {
          console.warn("[FRONT] Falha ao remover empresa:", await respostaRemocao.text());
        } else {
          console.log("[FRONT] Empresa removida com sucesso.");
        }
      } catch (erroRemocao) {
        console.error("[FRONT] Erro ao tentar remover empresa:", erroRemocao);
      }

      Swal.fire({
        title: "Erro ao cadastrar usuário",
        text: "Cadastro da empresa foi desfeito para manter integridade dos dados.",
        icon: "error",
        confirmButtonText: "Fechar",
        confirmButtonColor: "#800000",
      });
    }

  } catch (erroEmpresa) {
    console.error("[FRONT] Erro ao cadastrar empresa:", erroEmpresa);

    Swal.fire({
      title: "Erro ao cadastrar empresa",
      text: erroEmpresa.message || "Ocorreu um erro desconhecido.",
      icon: "error",
      confirmButtonText: "Fechar",
      confirmButtonColor: "#800000",
    });
  }
}

// Função de cadastro do usuário junto do cadastro da empresa
async function enviarFormularioUsuario(token) {
  const nome = document.getElementById("nome_completo").value;
  const email = document.getElementById("email_fisico").value;
  const cpf = document.getElementById("cpf").value;
  const telefone = document.getElementById("telefone").value;
  const senha = document.getElementById("senha_input").value;
  const tipoConta = document.getElementById("tipo_conta").value;

  const usuarioPayload = {
    nome,
    email,
    cpf,
    telefone,
    senha,
    tipoConta,
    token
  };

  console.log("[FRONT] Enviando dados de usuário:", usuarioPayload);
  try {
    const resposta = await postJSON("/usuarios/cadastrar", usuarioPayload);

    console.log("[FRONT] Cadastro de usuário efetuado com sucesso");

    return resposta;
  } catch (erro) {
    console.error("[FRONT] Erro no cadastro do usuário:", erro);
    throw erro;
  }
}

// Validar os tokens do usuario
async function validarToken(token) {
  try {
    const data = await postJSON("/empresa/validarToken", { token });

    if (data.message === "Token válido") {
      console.log("Token é válido para empresa:", data.empresa);

      try {
        await enviarFormularioUsuario(token);

        Swal.fire({
          title: "Cadastro efetuado",
          icon: "success",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#800000",
        }).then(() => {
          window.location.href = "/login.html";
        });

        return true;

      } catch (erroCadastro) {
        console.error("Erro ao cadastrar usuário:", erroCadastro);

        Swal.fire({
          title: "Erro ao cadastrar usuário",
          text: "O token era válido, mas ocorreu uma falha ao cadastrar o usuário.",
          icon: "error",
          confirmButtonText: "Fechar",
          confirmButtonColor: "#800000",
        });

        return false;
      }

    } else {
      console.warn("Token inválido:", data);
      Swal.fire("Token inválido", "O token não corresponde a nenhuma empresa.", "error");
      return false;
    }

  } catch (erroRequisicao) {
    console.error("Erro ao validar token:", erroRequisicao);
    Swal.fire("Erro", "Não foi possível validar o token. Tente novamente mais tarde.", "error");
    return false;
  }
}

// Função responsável pela validação de cada etapa do formulário
function validarEtapa(numEtapa) {
  switch (numEtapa) {
    case 1: {
      const nomeCompleto = document.getElementById("nome_completo").value.trim();
      const emailFisico = document.getElementById("email_fisico").value.trim();
      const cpf = document.getElementById("cpf").value.trim();
      const telefone = document.getElementById("telefone").value.trim();
      const senhaVar = document.getElementById("senha_input").value.trim();
      const confirmacaoSenhaVar = document.getElementById("confirmacao_senha_input").value.trim();

      if (!nomeCompleto || !emailFisico || !cpf || !telefone) {
        Swal.fire({
          title: "Atenção!",
          text: "Por favor, preencha todos os campos.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }

      if (!emailFisico.includes("@")) {
        Swal.fire({
          title: "E-mail inválido!",
          text: "Por favor, insira um e-mail válido com '@'.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }

      if (cpf.length < 11) {
        Swal.fire({
          title: "CPF muito curto!",
          text: "O CPF deve ter pelo menos 11 caracteres.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }

      if (telefone.length < 11) {
        Swal.fire({
          title: "Telefone muito curto!",
          text: "O telefone deve ter pelo menos 11 caracteres.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }

      if (!senhaVar || !confirmacaoSenhaVar) {
        Swal.fire({
          title: "Atenção!",
          text: "Por favor, preencha a senha e a confirmação de senha.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }

      if (senhaVar !== confirmacaoSenhaVar) {
        Swal.fire({
          title: "Senhas não coincidem!",
          text: "As senhas digitadas não são iguais.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }

      if (senhaVar.length < 8) {
        Swal.fire({
          title: "Senha muito curta!",
          text: "A senha deve ter pelo menos 8 caracteres.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }
      return true;
    }

    case 2: {
      const nomeEmpresa = document.getElementById("nome_empresa").value.trim();
      const cnpj = document.getElementById("cnpj").value.trim();
      const emailEmpresa = document.getElementById("email_empresa").value.trim();
      const telefoneEmpresa = document.getElementById("telefone_empresa").value.trim();

      if (!nomeEmpresa || !cnpj || !emailEmpresa || !telefoneEmpresa) {
        Swal.fire({
          title: "Atenção!",
          text: "Por favor, preencha todos os campos da empresa.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }

      if (!emailEmpresa.includes("@")) {
        Swal.fire({
          title: "E-mail inválido!",
          text: "Por favor, insira um e-mail corporativo válido.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }

      if (cnpj.replace(/\D/g, "").length !== 14) {
        Swal.fire({
          title: "CNPJ inválido!",
          text: "O CNPJ deve conter 14 números.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }

      if (telefoneEmpresa.replace(/\D/g, "").length < 10) {
        Swal.fire({
          title: "Telefone inválido!",
          text: "O telefone deve conter ao menos 10 dígitos.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }
      return true;
    }
  }
}

// Função para navegar para a próxima etapa
function proximaEtapa(numEtapa) {
  if (validarEtapa(numEtapa - 1)) {
    // Oculta todas as etapas
    document.querySelectorAll(".etapa").forEach((etapa) => etapa.classList.remove("active"));
    // Exibe a etapa desejada
    document.getElementById("etapa" + numEtapa).classList.add("active");

    // Pular etapa 2 se o token foi informado
    if (numEtapa === 2 && tokenInformado) {
      document.querySelectorAll(".etapa").forEach((etapa) => etapa.classList.remove("active"));
      document.getElementById("etapa3").classList.add("active");
    } else {
      document.getElementById("etapa" + numEtapa).classList.add("active");
    }
  }
}

// Função para voltar para etapa anterior
function voltarEtapa(numEtapa) {
  document.querySelectorAll(".etapa").forEach((etapa) => etapa.classList.remove("active"));
  document.getElementById("etapa" + numEtapa).classList.add("active");
}

// Função para limpar os inputs do formulário após sucesso
function limparFormulario() {
  document.getElementById("nome_completo").value = "";
  document.getElementById("email_fisico").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("senha_input").value = "";
  document.getElementById("confirmacao_senha_input").value = "";
}
