import { DOM } from './executeLogin';
import { sumirMensagem } from './executeLogin';

export function cadastrar() {
  
  var tipoContaVar = document.getElementById('tipo_conta').value
  var nomeVar = document.getElementById("nome_completo").value;
  var emailVar = document.getElementById("email_fisico").value;
  var cpfVar = document.getElementById("cpf").value;
  var telefoneVar = document.getElementById("telefone").value;
  var senhaVar = document.getElementById("senha_input").value;
  var confirmacaoSenhaVar = document.getElementById("confirmacao_senha_input").value;

  // Verificando se há algum campo em branco ou se as senhas não coincidem
  if (
      nomeVar === "" ||
      cpfVar === "" ||
      telefoneVar === "" ||
      tipoContaVar === "" ||
      emailVar === "" ||
      senhaVar === "" ||
      confirmacaoSenhaVar === "" ||
      senhaVar !== confirmacaoSenhaVar
  ) {
      DOM.cardErro.style.display = "block";
      DOM.msgErro.innerText = "Preencha todos os campos e certifique-se de que as senhas coincidem.";
      setTimeout(sumirMensagem, 5000);
      return false;
  }

  console.log('Acabou a validação');
  fetch("/usuarios/cadastrar", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          tipoContaServer : tipoContaVar,
          nomeServer: nomeVar,
          emailServer: emailVar,
          cpfServer: cpfVar,
          telefoneServer: telefoneVar,
          senhaServer: senhaVar
      }),
  })
  .then(function(resposta) {
      console.log("Resposta: ", resposta);

      if (resposta.ok) {
          DOM.cardErro.style.display = "block";
          DOM.msgErro.innerText = "Cadastro realizado com sucesso! Redirecionando para tela de Login...";
          setTimeout(() => {
              window.location = "/login.html";
          }, 2000);
          limparFormulario();
      } else {
          throw Error("Houve um erro ao tentar realizar o cadastro!");
      }
  })
  .catch(function(erro) {
      console.log(`#ERRO: ${erro}`);
      DOM.cardErro.style.display = "block";
      DOM.msgErro.innerText = erro.message;
      setTimeout(sumirMensagem, 5000);
  });

  return false;
}


function limparFormulario() {
  nomeVar.value = "";
  emailVar.value = "";
  senhaVar.value = "";
  confirmacaoSenhaVar.value = "";
}

        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            const fileInput = document.getElementById('photoInput');
            const progress = document.getElementById('progress');
            const message = document.getElementById('message');
            
            formData.append('foto', fileInput.files[0]);
            
            try {
                progress.style.display = 'block';
                message.textContent = '';
                
                const response = await fetch('/profile/photo', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include' // Para enviar cookies/token
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Atualiza a imagem exibida
                    document.getElementById('profileImage').src = result.photoPath + '?t=' + Date.now();
                    message.textContent = result.message;
                    message.style.color = 'green';
                } else {
                    throw new Error(result.error || 'Erro ao enviar foto');
                }
            } catch (error) {
                message.textContent = error.message;
                message.style.color = 'red';
            } finally {
                progress.style.display = 'none';
            }
        })