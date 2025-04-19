const { json } = require("express")

var emaiVar = document.getElementById('email_input')
export const DOM = {
  cardErro : document.getElementById('card-error'),
  msgErro:  document.getElementById('msg_error')
  
}

export function sumirMensagem() { cardErro.style.display = "none" }


export function autenticar() {
  if (emaiVar == "" || senhaVar == "") {
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
        emaiVar,
        senhaVar
      })
    }).then(function (resposta) {
      if (resposta.ok) {
        resposta.json().then(json => {
            sessionStorage.EMAIL_USUARIO = json.email;
            sessionStorage.NOME_USUARIO = json.nome;
            sessionStorage.ID_USUARIO = json.id;
            setTimeout(function() {
                window.location = "poslogin.html";
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

  return false;
}