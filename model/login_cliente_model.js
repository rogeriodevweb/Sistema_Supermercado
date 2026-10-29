
const db = require("../conexao/conexao");

const loginClienteModel = {
    buscarCliente: (email, callback) => {
        const sql = `
            SELECT
                idcliente,
                nome,
                email,
                senha,
                status
            FROM cliente
            WHERE email = ?
            ORDER BY idcliente ASC
            LIMIT 1
        `;

        db.query(sql, [email], callback);
    }
};

module.exports = loginClienteModel;
