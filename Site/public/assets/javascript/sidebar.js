let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let navList = document.querySelector(".nav-list");

closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  navList.classList.toggle("scroll"); // Assuming 'scroll' class manages overflow/scrolling
  menuBtnChange();
});

searchBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  navList.classList.toggle("scroll"); // Assuming 'scroll' class manages overflow/scrolling
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

  if (nome && tipoConta) {
    document.getElementById("nomeUsuario").textContent = nome;
    document.getElementById("tipoContaUsuario").textContent = tipoConta;
  }

  const menuLinks = document.querySelectorAll('.nav-list a.menu-link'); 
  const dashLink = document.getElementById('minha-dashboard-link-dinamico');

  if(dashLink && tipoConta){
    dashLink.href= `dashboard-${tipoConta.toLowerCase()}.html`;
  }

  var currentFileName = window.location.pathname.split('/').pop();
  if (currentFileName === '' || currentFileName === '/') {
      currentFileName = 'index.html';
  }

  menuLinks.forEach(link => {
    link.classList.remove('active');
  });

  menuLinks.forEach(link => {
    const linkHref = link.getAttribute('href');

    if (currentFileName === linkHref) {
      link.classList.add('active');
    }
  });
};
  menuLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (currentPath.endsWith(linkHref)) {
      link.classList.add('active'); 
    } else {

    }
  });