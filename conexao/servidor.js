
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORTA = 3000;

/* =========================================
   CONFIGURAÇÕES
========================================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================
   CONEXÃO COM O BANCO DE DADOS
========================================= */

const conexao = require("./conexao");
app.locals.conexao = conexao;

/* =========================================
   ARQUIVOS ESTÁTICOS
========================================= */

app.use(express.static(path.join(__dirname, "..")));

/* =========================================
   CONTROLLERS
========================================= */

const cadastroClienteController = require("../controller/cadastro_cliente_controller");
const loginClienteController = require("../controller/login_cliente_controller");

/* =========================================
   CADASTRO DO CLIENTE
========================================= */

app.post("/cadastro", (req, res) => {
    console.log("POST /cadastro recebido");
    cadastroClienteController(req, res);
});

/* =========================================
   LOGIN DO CLIENTE
========================================= */

app.post("/login", (req, res) => {
    console.log("POST /login recebido");
    loginClienteController.login(req, res);
});

/* =========================================
   ROTA DE TESTE
========================================= */

app.post("/teste-rota", (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "A rota POST está funcionando!"
    });
});

/* =========================================
   STATUS DO SERVIDOR
========================================= */

app.get("/api/status", (req, res) => {
    res.json({
        servidor: "online",
        mensagem: "Sistema Supermercado funcionando!"
    });
});

/* =========================================
   INICIAR SERVIDOR
========================================= */

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
    console.log("Rota POST /cadastro registrada");
    console.log("Rota POST /login registrada");
});
