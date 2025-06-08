var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

// Importação dos routers
var indexRouter = require("./src/routes/index");
var usuarioRouter = require('./src/routes/usuarios');
var logsRouter = require('./src/routes/logs')
var diretorRouter = require('./src/routes/diretor');
var gestorRouter = require('./src/routes/gestor');

var dashboardPesquisadorRouter= require('./src/routes/dashboardPesquisador');
// ----------------------------------------------------------------- //
// CONFIGURAÇÕES PARA CONEXÃO DIRETAMENTE COM NOSSO BUCKET NO AWS S3 //
// ----------------------------------------------------------------- //

const awsRouter = require("./src/routes/aws");
app.use("/aws", awsRouter);

// ----------------------------------------------------------------- //
// ----------------------------------------------------------------- //
// ----------------------------------------------------------------- //

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/diretor", diretorRouter);
app.use("/usuarios", usuarioRouter);    
app.use('/logs', logsRouter);
app.use('/gestor', gestorRouter);



app.use('/dashboardPesquisador', dashboardPesquisadorRouter)
app.listen(PORTA_APP, function () {
    console.log(`
     ██      ███████  █████  ██████  ███    ██ ███████ ██    ██ 
     ██      ██      ██   ██ ██   ██ ████   ██ ██       ██  ██  
     ██      █████   ███████ ██████  ██ ██  ██ █████     ████   
     ██      ██      ██   ██ ██   ██ ██  ██ ██ ██         ██    
     ███████ ███████ ██   ██ ██   ██ ██   ████ ██         ██    
                                                                                                                                                                                                                                      
    📊 Servidor Learnfy iniciado com sucesso! Seus dados estão prontos para serem analisados! 📊
    🚀 Acesse agora e tome decisões mais inteligentes com nossos gráficos: http://${HOST_APP}:${PORTA_APP} 🚀\n\n
    Você está operando em um ambiente: ${process.env.AMBIENTE_PROCESSO}.\n\n
    - 🟢 Se for desenvolvimento, você está analisando os dados localmente.
    - 🔴 Se for produção, seus dados estão prontos para o mundo! 
    Para ajustar seu ambiente, edite o arquivo 'app.js'.\n\n
    Vamos transformar dados em decisões inteligentes! 📈\n\n`);
});
