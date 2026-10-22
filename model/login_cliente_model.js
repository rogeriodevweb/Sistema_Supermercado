
const db = require("../conexao/conexao");

const loginClienteModel = {
    buscarCliente: (email, callback) => {
        const sql = `
            SELECT
                idcliente,
                nome,
                email,
                senha
            FROM cliente
            WHERE email = ?
            LIMIT 1
        `;

        db.query(sql, [email], callback);
    }
};

module.exports = loginClienteModel;
