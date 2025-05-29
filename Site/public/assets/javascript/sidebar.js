let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let navList = document.querySelector(".nav-list");

closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  navList.classList.toggle("scroll");
  menuBtnChange();
});

searchBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  navList.classList.toggle("scroll");
  menuBtnChange();
});

function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-chevron-left");
  } else {
    closeBtn.classList.replace("bx-chevron-left", "bx-menu");
  }
}


document.getElementById("log_out").addEventListener("click", function () {
  Swal.fire({
    title: "Sair da conta?",
    text: "Tem certeza que deseja sair?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, sair",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#800000",
    cancelButtonColor: "#999999",
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.clear();
      window.location.href = "/login.html";
    }
  });
});

window.onload = function () {
  const nome = sessionStorage.getItem("NOME_USUARIO");
  const tipoConta = sessionStorage.getItem("TIPO_CONTA");
  const foto = sessionStorage.getItem("FOTO_USUARIO");

  if (nome && tipoConta) {
    document.getElementById("nomeUsuario").textContent = nome;
    document.getElementById("tipoContaUsuario").textContent = tipoConta;
  }

  const imagem = document.getElementById("profileImg");

  if (imagem && foto && foto !== "null" && foto !== "undefined") {
    const caminho = `../upload/${foto}`;
    imagem.src = caminho;
  } else {
    imagem.src = "../images/user.png";
  }
};
