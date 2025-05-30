// Função que retorna o valor do tipo de conta selecionada
function getTipoConta() {
  return document.getElementById("tipo_conta").value;
}

// Função responsável pela validação de cada etapa do formulário
function validarEtapa(numEtapa) {
  switch (numEtapa) {
    case 0:
      if (getTipoConta() === "") {
        Swal.fire({
          title: "Atenção!",
          text: "Por favor, selecione um tipo de conta.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }
      return true;

    case 1:
      const nomeCompleto = document.getElementById("nome_completo").value;
      const emailFisico = document.getElementById("email_fisico").value;
      const cpf = document.getElementById("cpf").value;
      const telefone = document.getElementById("telefone").value;

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
      return true;

    case 2:
      const senhaVar = document.getElementById("senha_input").value;
      const confirmacaoSenhaVar = document.getElementById(
        "confirmacao_senha_input"
      ).value;

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

    case 3:

    default:
      return true;
  }
}

// Função para navegar para a próxima etapa
function proximaEtapa(numEtapa) {
  if (validarEtapa(numEtapa - 1)) {
    // Oculta todas as etapas
    document
      .querySelectorAll(".etapa")
      .forEach((etapa) => etapa.classList.remove("active"));
    // Exibe a etapa desejada
    document.getElementById("etapa" + numEtapa).classList.add("active");
  }
}

// Função para voltar para uma etapa anterior
function voltarEtapa(numEtapa) {
  document
    .querySelectorAll(".etapa")
    .forEach((etapa) => etapa.classList.remove("active"));
  document.getElementById("etapa" + numEtapa).classList.add("active");
}

function enviarFormulario() {
  var tipoContaVar = document.getElementById("tipo_conta").value;
  var nomeVar = document.getElementById("nome_completo").value;
  var emailVar = document.getElementById("email_fisico").value;
  var cpfVar = document.getElementById("cpf").value;
  var telefoneVar = document.getElementById("telefone").value;
  var senhaVar = document.getElementById("senha_input").value;
  var confirmacaoSenhaVar = document.getElementById(
    "confirmacao_senha_input"
  ).value;

  // Verificando se há algum campo em branco ou se as senhas não coincidem
  if (
    nomeVar === "" ||
    cpfVar === "" ||
    telefoneVar === "" ||
    tipoContaVar === "" ||
    emailVar === "" ||
    senhaVar === "" ||
    confirmacaoSenhaVar === "" ||
    senhaVar !== confirmacaoSenhaVar
  ) {
    DOM.cardErro.style.display = "block";
    DOM.msgErro.innerText =
      "Preencha todos os campos e certifique-se de que as senhas coincidam.";
    setTimeout(sumirMensagem, 5000);
    return false;
  }

  console.log("Acabou a validação");

  fetch("/usuarios/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tipoContaVar: tipoContaVar,
      nomeVar: nomeVar,
      emailVar: emailVar,
      cpfVar: cpfVar,
      telefoneVar: telefoneVar,
      senhaVar: senhaVar,
    }),
  })
    .then(function (resposta) {
      console.log("Resposta: ", resposta);

      if (resposta.ok) {
        Swal.fire({
          title: "Seja bem-vindo!",
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        setTimeout(() => {
          window.location = "/login.html";
        }, 2000);
        limparFormulario();
      }
    })
    .catch(function (erro) {
      console.log(`#ERRO: ${erro}`);
      setTimeout(sumirMensagem, 5000);
    });
}

function limparFormulario() {
  nomeVar.value = "";
  emailVar.value = "";
  senhaVar.value = "";
  confirmacaoSenhaVar.value = "";
}

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const fileInput = document.getElementById("photoInput");
  const progress = document.getElementById("progress");
  const message = document.getElementById("message");

  formData.append("foto", fileInput.files[0]);

  try {
    progress.style.display = "block";
    message.textContent = "";

    const response = await fetch("/profile/photo", {
      method: "POST",
      body: formData,
      credentials: "include", // Para enviar cookies/token
    });

    if (!response.ok) {
      throw new Error("Falha na requisição: " + response.statusText);
    }

    let result;
    try {
      result = await response.json();
    } catch (e) {
      console.log("Erro ao tentar converter a resposta para JSON: ", e);
      throw new Error("Resposta não é JSON válido");
    }

    console.log("Resultado da resposta: ", result);

    if (result.photoPath) {
      document.getElementById("profileImage").src =
        result.photoPath + "?t=" + Date.now();
      message.textContent = result.message || "Foto carregada com sucesso";
      message.style.color = "green";
    } else {
      throw new Error("Campo photoPath ausente na resposta");
    }
  } catch (error) {
    message.textContent = error.message;
    message.style.color = "red";
  } finally {
    progress.style.display = "none";
  }
});
