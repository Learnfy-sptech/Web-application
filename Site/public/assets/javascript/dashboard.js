const nome = sessionStorage.getItem("NOME_USUARIO");

const userName = document.getElementById('name-user');

window.onload = function (nome) {
  userName.innerHTML = nome ?? "Usuário";
}

function clear() {
  sessionStorage.removeItem(EMAIL_USUARIO );
  sessionStorage.removeItem(NOME_USUARIO);
  sessionStorage.removeItem(ID_USUARIO);
  window.location.href('index.html');
}