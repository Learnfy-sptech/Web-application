function logar() {
    const emailVar = document.getElementById("email_input").value;
    const senhaVar = document.getElementById("senha_input").value;

    if (!emailVar || !senhaVar) {
      Swal.fire({
        title: "Campos vazios!",
        text: "Por favor, preencha o e-mail e a senha.",
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#800000",
      });
      return false;
    }

    if (!emailVar.includes("@")) {
      Swal.fire({
        title: "E-mail inválido!",
        text: "Por favor, insira um e-mail válido.",
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
    
  if (emailVar == "" || senhaVar == "") {
    cardErro.style.display = "block"
    msgErro.innerText = "Preencha todos os campos"
    setTimeout(sumirMensagem, 2000)
    return false;
  } else {
    fetch("/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        emailVar,
        senhaVar
      })
    }).then(function (resposta) {
      if (resposta.ok) {
        resposta.json().then(json => {
            sessionStorage.EMAIL_USUARIO = json.email;
            sessionStorage.NOME_USUARIO = json.nome;
            sessionStorage.ID_USUARIO = json.id;
            console.log(EMAIL_USUARIO, NOME_USUARIO, ID_USUARIO)
            setTimeout(function() {
                window.location = "dashboard.html";
            }, 1000);
        });
    } else {
        resposta.text().then(texto => {
            console.error(texto);
            document.getElementById("cardErro").style.display = "block";
            document.getElementById("mensagem_erro").innerText = texto;
            setTimeout(sumirMensagem, 5000);
        });
    }
    }).catch(function(erro) {
      console.log(erro);
      document.getElementById("cardErro").style.display = "block";
      document.getElementById("mensagem_erro").innerText = "Houve um erro ao tentar realizar o login.";
      setTimeout(sumirMensagem, 5000);
  });
  }
  }

  