
const mysql = require("mysql2");

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "S3n4c@2026",
    database: "supermercado"
});

conexao.connect((erro) => {
    if (erro) {
        console.error("Erro ao conectar ao MySQL:", erro.message);
        return;
    }

    console.log("Conexão com o MySQL estabelecida com sucesso!");
});

module.exports = conexao;
