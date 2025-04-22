document.getElementById("foto").addEventListener("change", function (e) {
  const fileName = e.target.files[0]
    ? e.target.files[0].name
    : "Nenhum arquivo selecionado";
  document.getElementById("file-name").textContent = fileName;
});


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
      const confirmacaoSenhaVar = document.getElementById("confirmacao_senha_input").value;

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
      const foto = document.getElementById("foto");
      if (foto.files.length === 0) {
        Swal.fire({
          title: "Foto obrigatória!",
          text: "Por favor, selecione uma foto de perfil.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }

      const fileType = foto.files[0].type;
      if (!fileType.startsWith("image/") || !/(png|jpg|jpeg)$/i.test(fileType)) {
        Swal.fire({
          title: "Formato inválido!",
          text: "A foto deve ser um arquivo de imagem no formato PNG, JPG ou JPEG.",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000",
        });
        return false;
      }
      return true;

    default:
      return true;
  }
}

// Função para navegar para a próxima etapa
function proximaEtapa(numEtapa) {
  if (validarEtapa(numEtapa - 1)) {
    // Oculta todas as etapas
    document.querySelectorAll(".etapa").forEach(etapa => etapa.classList.remove("active"));
    // Exibe a etapa desejada
    document.getElementById("etapa" + numEtapa).classList.add("active");
  }
}

// Função para voltar para uma etapa anterior
function voltarEtapa(numEtapa) {
  document.querySelectorAll(".etapa").forEach(etapa => etapa.classList.remove("active"));
  document.getElementById("etapa" + numEtapa).classList.add("active");
}

function enviarFormulario() {
  var tipoContaVar = document.getElementById('tipo_conta').value
  var nomeVar = document.getElementById("nome_completo").value;
  var emailVar = document.getElementById("email_fisico").value;
  var cpfVar = document.getElementById("cpf").value;
  var telefoneVar = document.getElementById("telefone").value;
  var senhaVar = document.getElementById("senha_input").value;
  var confirmacaoSenhaVar = document.getElementById("confirmacao_senha_input").value;

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
    DOM.msgErro.innerText = "Preencha todos os campos e certifique-se de que as senhas coincidem.";
    setTimeout(sumirMensagem, 5000);
    return false;
  }

  console.log('Acabou a validação');
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
      senhaVar: senhaVar
    }),
  })
    .then(function (resposta) {
      console.log("Resposta: ", resposta);

      if (resposta.ok) {
        DOM.cardErro.style.display = "block";
        DOM.msgErro.innerText = "Cadastro realizado com sucesso! Redirecionando para tela de Login...";
        setTimeout(() => {
          window.location = "/login.html";
        }, 2000);
        limparFormulario();
      } else {
        throw Error("Houve um erro ao tentar realizar o cadastro!");
      }
    })
    .catch(function (erro) {
      console.log(`#ERRO: ${erro}`);
      DOM.cardErro.style.display = "block";
      DOM.msgErro.innerText = erro.message;
      setTimeout(sumirMensagem, 5000);
    });

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
  else {
    Swal.fire({
      title: "Erro!",
      text: "Houve um erro ao tentar realizar o cadastro.",
      icon: "error",
      confirmButtonText: "Ok",
      confirmButtonColor: "#800000",
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  VMasker(document.getElementById("cpf")).maskPattern("999.999.999-99");

  const telefoneInput = document.getElementById("telefone");
  VMasker(telefoneInput).maskPattern("(99) 9999-9999");

  telefoneInput.addEventListener("input", function () {
    if (this.value.replace(/\D/g, "").length > 10) {
      VMasker(this).maskPattern("(99) 99999-9999");
    } else {
      VMasker(this).maskPattern("(99) 9999-9999");
    }
  });
});
