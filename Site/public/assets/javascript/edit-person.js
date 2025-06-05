   function loadUserData() {
      const nomeUsuario = sessionStorage.getItem('NOME_USUARIO');
      const telefoneUsuario = sessionStorage.getItem('TELEFONE_USUARIO');

      if (nomeUsuario) {
        document.getElementById('name').value = nomeUsuario;
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
      }
      if (telefoneUsuario) {
        document.getElementById('telefone').value = telefoneUsuario;
      }
    }


    document.addEventListener('DOMContentLoaded', function () {
      const fileInput = document.getElementById('fileInput');
      const profileImage = document.getElementById('profileImage');
      const fileStatus = document.getElementById('fileStatus');

      fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = function (e) {
            profileImage.src = e.target.result;
            fileStatus.textContent = 'Arquivo selecionado';
          };
          reader.readAsDataURL(file);
        } else {
          fileStatus.textContent = 'No file chosen';
          profileImage.src = 'assets/images/user.png';
        }
      });
    });



document
  .getElementById("formPerfil")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome           = document.getElementById("name").value.trim();
    const telefone       = document.getElementById("telefone").value.trim();
    const senha          = document.getElementById("password-change").value.trim();
    const confirmarSenha = document.getElementById("confirm-password").value.trim();
    const fileInput      = document.getElementById("fileInput");
    const userId         = sessionStorage.getItem("ID_USUARIO");

    if ((senha || confirmarSenha) && senha !== confirmarSenha) {
      return Swal.fire({
        title: "Senhas não coincidem!",
        text: "As senhas digitadas não são iguais.",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#800000",
      });
    }

    if (!nome && !telefone && !senha && fileInput.files.length === 0) {
      return Swal.fire({
        title: "Nada para atualizar!",
        text: "Preencha ao menos um campo antes de salvar.",
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#800000",
      });
    }

    const { isConfirmed } = await Swal.fire({
      title: "Tem certeza?",
      text: "Você deseja realmente salvar as alterações?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, salvar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#800000",
      cancelButtonColor: "#999999",
    });
    if (!isConfirmed) return;

    try {
      const formData = new FormData();
      formData.append("id", userId);
      if (nome)     formData.append("nome", nome);
      if (telefone) formData.append("telefone", telefone);
      if (senha)    formData.append("senha", senha);

      const resUser = await fetch("/usuarios/atualizar", {
        method: "POST",
        body: formData,
      });
      if (!resUser.ok) throw new Error("Falha ao atualizar dados do usuário");

      if (fileInput.files.length > 0) {
        const fotoData = new FormData();
        fotoData.append("file", fileInput.files[0]);

        const resFoto = await fetch(`/aws/usuarios/${userId}/imagem-perfil`, {
          method: "POST",
          body: fotoData,
        });
        if (!resFoto.ok) throw new Error("Falha ao enviar foto para o S3");
      }

      await Swal.fire({
        title: "Sucesso!",
        text: "Perfil atualizado com sucesso.",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#800000",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Erro!",
        text: err.message,
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#800000",
      });
    }
  });
