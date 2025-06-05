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
        sessionStorage.TIPO_CONTA = json.tipoConta;
        sessionStorage.FOTO_USUARIO = json.foto_perfil_path 
        sessionStorage.TELEFONE_USUARIO = json.telefone;
  
        Swal.fire({
          title: "Login realizado com sucesso!",
          text: "Você será redirecionado...",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
  
        setTimeout(function () {
          if (emailVar.includes("@learnfy")) {
            window.location = "import.html";
          } else {
            window.location = "selection-dashboard.html";
          }
        }, 2000);
      });
    } else {
      resposta.text().then(texto => {
        Swal.fire({
          title: "Erro ao logar",
          text: texto,
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#800000"
        });
      });
    }
  })
  .catch(function (erro) {
    console.log(erro);
    Swal.fire({
      title: "Erro inesperado",
      text: "Houve um erro ao tentar realizar o login.",
      icon: "error",
      confirmButtonText: "Ok",
      confirmButtonColor: "#800000"
    });
  });
}
