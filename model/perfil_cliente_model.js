const conexao = require("../conexao/conexao");

const perfilClienteModel = {

    buscarPorId: (id, callback) => {
        const sql = `
            SELECT idcliente, nome, email, telefone
            FROM cliente
            WHERE idcliente = ?
            LIMIT 1
        `;

        conexao.query(sql, [id], callback);
    },

    atualizar: (id, dados, callback) => {
        const sql = `
            UPDATE cliente
            SET nome = ?, email = ?, telefone = ?
            WHERE idcliente = ?
        `;

        conexao.query(
            sql,
            [dados.nome, dados.email, dados.telefone, id],
            callback
        );
    }

};

module.exports = perfilClienteModel;