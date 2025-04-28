const { json } = require("express")

var emaiVar = document.getElementById('email_fisico')
var senhaVar = document.getElementById('senha_input')
export const DOM = {
  cardErro : document.getElementById('card-error'),
  msgErro:  document.getElementById('msg_error')
  
}

function sumirMensagem() { DOM.cardErro.style.display = "none" }


function autenticar() {
  
}