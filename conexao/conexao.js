const mysql = require("mysql2");

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Sistema_Supermercado"
});

conexao.connect((erro) => {
    if (erro) {
        console.error("❌ Erro ao conectar ao MySQL:", erro.message);
        return;
    }

    console.log("✅ Conectado ao MySQL com sucesso!");
});

module.exports = conexao;