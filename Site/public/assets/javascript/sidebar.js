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
    cancelButtonColor: "#999999",
    confirmButtonColor: "#800000",
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.clear();
      window.location.href = "/login.html";
    }
  });
});

window.onload = function () {
  const nome = sessionStorage.getItem("NOME_USUARIO");
  var tipoContaArmazenado = sessionStorage.getItem("TIPO_CONTA"); 
  const slackId = sessionStorage.getItem("SLACK_ID");
  const slackItem = document.getElementById("item-slack");
  const slackLink = document.getElementById("link-slack");

  if (slackId && slackItem && slackLink) {
    slackLink.href = `https://slack.com/app_redirect?channel=${slackId}`;
    slackItem.style.display = "flex";
  }

  if (nome && tipoContaArmazenado) {
    document.getElementById("nomeUsuario").textContent = nome;
    document.getElementById("tipoContaUsuario").textContent = tipoContaArmazenado;
  }

  const menuLinks = document.querySelectorAll('.nav-list a.menu-link'); 
  const dashLink = document.getElementById('minha-dashboard-link-dinamico');

  if (tipoContaArmazenado === "DIRETOR ACADEMICO") {
    tipoContaArmazenado = "diretor"; 
  }

  let dashboardFileNamePart = '';

  if (tipoContaArmazenado) {
    const tipoContaLower = tipoContaArmazenado.toLowerCase(); 
    const dashboardMap = {
      'gestor': 'gestor',
      'pesquisador': 'pesquisador',
    };

    if (dashboardMap[tipoContaLower]) {
      dashboardFileNamePart = dashboardMap[tipoContaLower];
    } else {
      dashboardFileNamePart = tipoContaLower;
    }
  }

  if (dashLink && dashboardFileNamePart) {
    dashLink.href = `dashboard-${dashboardFileNamePart}.html`;
  }

  let currentFileName = window.location.pathname.split('/').pop();
  if (currentFileName === '' || currentFileName === '/') {
    currentFileName = 'index.html';
  }

  menuLinks.forEach(link => {
    link.classList.remove('active');
  });

  menuLinks.forEach(link => {
    const linkHref = link.getAttribute('href');

    if (currentFileName === linkHref ||
      (link.id === 'minha-dashboard-link-dinamico' && currentFileName.startsWith('dashboard-'))) {
      link.classList.add('active');
    }
  });
};