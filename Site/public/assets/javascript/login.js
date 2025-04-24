function logar() {
    const email = document.getElementById("email_fisico").value.trim();
    const senha = document.getElementById("senha_input").value;

    if (!email || !senha) {
      Swal.fire({
        title: "Campos vazios!",
        text: "Por favor, preencha o e-mail e a senha.",
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#800000",
      });
      return false;
    }

    if (!email.includes("@")) {
      Swal.fire({
        title: "E-mail inválido!",
        text: "Por favor, insira um e-mail válido.",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#800000",
      });
      return false;
    }

    if (senha.length < 8) {
      Swal.fire({
        title: "Senha muito curta!",
        text: "A senha deve ter pelo menos 8 caracteres.",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#800000",
      });
      return false;
    }

  }