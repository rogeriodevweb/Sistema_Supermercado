const conexao = require("../conexao/conexao");

const indexModel = {

    listarPedidos: (callback) => {

        const sql = `
            SELECT
                id,
                numero_pedido,
                status,
                data_pedido,
                horario_entrega,
                total
            FROM pedidos
            ORDER BY data_pedido DESC, id DESC
        `;

        db.query(sql, callback);
    },

    listarPedidosEntrega: (callback) => {

        const sql = `
            SELECT
                id,
                numero_pedido,
                status,
                data_pedido,
                horario_entrega,
                total
            FROM pedidos
            WHERE status IN ('Em preparo', 'A caminho')
            ORDER BY data_pedido ASC
        `;

        db.query(sql, callback);
    },

    buscarPedido: (id, callback) => {

        const sql = `
            SELECT
                id,
                numero_pedido,
                status,
                data_pedido,
                horario_entrega,
                total
            FROM pedidos
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    }
};

module.exports = indexModel;