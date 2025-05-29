document.getElementById("formPerfil").addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.getElementById("name").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const senha = document.getElementById("password-change").value.trim();
  const confirmarSenha = document.getElementById("confirm-password").value.trim();
  const fileInput = document.getElementById("fileInput");

  // Se as senhas forem preenchidas, verificar se são iguais
  if (senha || confirmarSenha) {
    if (senha !== confirmarSenha) {
      Swal.fire({
        title: "Senhas não coincidem!",
        text: "As senhas digitadas não são iguais.",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#800000",
      });
      return;
    }
  }

  // Verifica se ao menos um campo foi preenchido
  if (!nome && !telefone && !senha && fileInput.files.length === 0) {
    Swal.fire({
      title: "Nada para atualizar!",
      text: "Preencha ao menos um campo antes de salvar.",
      icon: "warning",
      confirmButtonText: "Ok",
      confirmButtonColor: "#800000",
    });
    return;
  }

  Swal.fire({
    title: "Tem certeza?",
    text: "Você deseja realmente salvar as alterações?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sim, salvar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#800000",
    cancelButtonColor: "#999999",
  }).then((result) => {
    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append("id", sessionStorage.getItem("ID_USUARIO"));

      if (nome) formData.append("nome", nome);
      if (telefone) formData.append("telefone", telefone);
      if (senha) formData.append("senha", senha);
      if (fileInput.files.length > 0) {
        formData.append("foto", fileInput.files[0]);
      }

      fetch("/usuarios/atualizar", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao atualizar perfil");
          }
          return response.json();
        })
        .then((data) => {
          Swal.fire({
            title: "Sucesso!",
            text: data.mensagem || "Perfil atualizado com sucesso, re-logue para ver as alterações.",
            icon: "success",
            confirmButtonText: "Ok",
            confirmButtonColor: "#800000",
          });

          if (fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
              document.getElementById("profileImage").src = reader.result;
            };
            reader.readAsDataURL(fileInput.files[0]);
          }
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            title: "Erro!",
            text: "Ocorreu um erro ao atualizar o perfil.",
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "#800000",
          });
        });
    }
  });
});
