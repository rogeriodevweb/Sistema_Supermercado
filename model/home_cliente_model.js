
const conexao = require("../conexao/conexao");

const indexModel = {

    // Listar somente os pedidos do cliente
    listarPedidos: (clienteId, callback) => {
        const sql = `
            SELECT
                p.idpedidos AS id,
                p.numeroPedido AS numero_pedido,
                p.statusPedido AS status,
                p.datapedido AS data_pedido,
                e.horarioEntrega AS horario_entrega,
                COALESCE(
                    SUM(
                        (ip.quantidade * ip.precoUnitario)
                        - COALESCE(ip.desconto, 0)
                    ),
                    0
                ) AS total
            FROM pedidos p
            LEFT JOIN entregas e
                ON e.identregas = p.entregas_identregas
            LEFT JOIN itensPedidos ip
                ON ip.pedidos_idpedidos = p.idpedidos
            WHERE p.cliente_idcliente = ?
            GROUP BY
                p.idpedidos,
                p.numeroPedido,
                p.statusPedido,
                p.datapedido,
                e.horarioEntrega
            ORDER BY p.datapedido DESC, p.idpedidos DESC
        `;

        conexao.query(sql, [clienteId], callback);
    },

    // Listar entregas pendentes do cliente
    listarPedidosEntrega: (clienteId, callback) => {
        const sql = `
            SELECT
                p.idpedidos AS id,
                p.numeroPedido AS numero_pedido,
                p.statusPedido AS status,
                p.datapedido AS data_pedido,
                e.horarioEntrega AS horario_entrega,
                COALESCE(
                    SUM(
                        (ip.quantidade * ip.precoUnitario)
                        - COALESCE(ip.desconto, 0)
                    ),
                    0
                ) AS total
            FROM pedidos p
            LEFT JOIN entregas e
                ON e.identregas = p.entregas_identregas
            LEFT JOIN itensPedidos ip
                ON ip.pedidos_idpedidos = p.idpedidos
            WHERE p.cliente_idcliente = ?
              AND p.statusPedido IN ('Em preparo', 'A caminho')
            GROUP BY
                p.idpedidos,
                p.numeroPedido,
                p.statusPedido,
                p.datapedido,
                e.horarioEntrega
            ORDER BY p.datapedido ASC, p.idpedidos ASC
        `;

        conexao.query(sql, [clienteId], callback);
    },

    // Buscar um pedido específico pertencente ao cliente
    buscarPedido: (id, clienteId, callback) => {
        const sql = `
            SELECT
                p.idpedidos AS id,
                p.numeroPedido AS numero_pedido,
                p.statusPedido AS status,
                p.datapedido AS data_pedido,
                e.horarioEntrega AS horario_entrega,
                COALESCE(
                    SUM(
                        (ip.quantidade * ip.precoUnitario)
                        - COALESCE(ip.desconto, 0)
                    ),
                    0
                ) AS total
            FROM pedidos p
            LEFT JOIN entregas e
                ON e.identregas = p.entregas_identregas
            LEFT JOIN itensPedidos ip
                ON ip.pedidos_idpedidos = p.idpedidos
            WHERE p.idpedidos = ?
              AND p.cliente_idcliente = ?
            GROUP BY
                p.idpedidos,
                p.numeroPedido,
                p.statusPedido,
                p.datapedido,
                e.horarioEntrega
        `;

        conexao.query(sql, [id, clienteId], callback);
    }
};

module.exports = indexModel;
