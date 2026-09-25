const express = require("express");
const cors = require("cors");

const app = express();
const PORTA = 3000;

// ==========================================
// CONFIGURAÇÕES
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// CONEXÃO COM MYSQL
// ==========================================

const conexao = require("./conexao");

// ==========================================
// ARQUIVOS DO SISTEMA
// ==========================================

app.use(express.static("public"));

// ==========================================
// ROTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {
    res.send("Sistema Supermercado funcionando!");
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORTA, () => {
    console.log("==========================================");
    console.log("🛒 SISTEMA SUPERMERCADO");
    console.log("==========================================");
    console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
    console.log("==========================================");
});