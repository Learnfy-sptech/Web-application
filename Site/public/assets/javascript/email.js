
emailjs.init("86GigBPlpSf4sdgDf"); 

document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const form = event.target;
    
    const name = document.getElementById('name_input');
    const email = document.getElementById('email_input');
    const message = document.getElementById('message');

    if (!name.value || !email.value || !message.value) {
        Swal.fire({
            icon: 'error',
            title: "Preencha todos os campos!",
            text: 'Por preencha, insira um título para o arquivo!',
            confirmButtonColor: '#800000'
        });
        return;
    }

    emailjs.sendForm('service_wdjdynn', 'template_km7gyn3', form)
        .then(function (response) {
            console.log('Sucesso!', response.status, response.text);

            Swal.fire({
                title: "Mensagem enviada com sucesso!",
                text: "Sua mensagem foi enviada com sucesso. Agradecemos o seu contato!",
                icon: "success",
                confirmButtonColor: '#800000'
            });
            
            form.reset();
        }, function (error) {
            console.log('Falha...', error);

            Swal.fire({
                title: "Erro ao enviar mensagem",
                text: "Houve um erro ao tentar enviar sua mensagem. Tente novamente mais tarde.",
                icon: "error",
                confirmButtonColor: '#800000'
            });
        });
});