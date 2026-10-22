
const conexao = require("../conexao/conexao.js");

const Cliente = {

    // Cadastrar cliente
    cadastrar: (cliente, callback) => {
        const sql = `
            INSERT INTO Cliente
            (nome, cpf, telefone, email, senha, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            cliente.nome,
            cliente.cpf,
            cliente.telefone,
            cliente.email,
            cliente.senha,
            cliente.status ?? 1
        ];

        conexao.query(sql, valores, callback);
    },

    // Listar clientes
    listar: (callback) => {
        const sql = "SELECT * FROM Cliente";
        conexao.query(sql, callback);
    },

    // Buscar cliente pelo ID
    buscarPorId: (idCliente, callback) => {
        const sql = "SELECT * FROM Cliente WHERE idCliente = ?";
        conexao.query(sql, [idCliente], callback);
    },

    // Buscar cliente pelo e-mail
    buscarPorEmail: (email, callback) => {
        const sql = "SELECT * FROM Cliente WHERE email = ?";
        conexao.query(sql, [email], callback);
    },

    // Atualizar cliente
    atualizar: (idCliente, cliente, callback) => {
        const sql = `
            UPDATE Cliente
            SET nome = ?,
                cpf = ?,
                telefone = ?,
                email = ?
            WHERE idCliente = ?
        `;

        const valores = [
            cliente.nome,
            cliente.cpf,
            cliente.telefone,
            cliente.email,
            idCliente
        ];

        conexao.query(sql, valores, callback);
    },

    // Excluir cliente
    excluir: (idCliente, callback) => {
        const sql = "DELETE FROM Cliente WHERE idCliente = ?";
        conexao.query(sql, [idCliente], callback);
    }
};

module.exports = Cliente;
