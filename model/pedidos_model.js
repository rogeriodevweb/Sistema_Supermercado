
const conexao = require("../conexao/conexao");

const pedidosModel = {
    /* =========================================
       BUSCAR PEDIDO POR CÓDIGO
    ========================================= */

    listarPorCodigo(codigo, callback) {
        const sql = `
            SELECT
                p.idpedidos,
                p.numeroPedido,
                p.datapedido,
                p.statusPedido,
                p.observacao,
                e.dataEntrega,
                e.horarioEntrega,
                e.statusEntrega,
                c.nome AS nomeDestinatario,
                en.rua,
                en.numero,
                en.complemento,
                en.bairro,
                en.cidade,
                en.estado,
                en.cep,
                pr.nome AS nomeProduto,
                ip.quantidade,
                ip.precoUnitario,
                ip.desconto
            FROM pedidos p
            LEFT JOIN entregas e
                ON e.identregas = p.entregas_identregas
            LEFT JOIN cliente c
                ON c.idcliente = p.cliente_idcliente
            LEFT JOIN endereco en
                ON en.idEndereco = (
                    SELECT en2.idEndereco
                    FROM endereco en2
                    WHERE en2.cliente_idcliente = p.cliente_idcliente
                    ORDER BY en2.idEndereco DESC
                    LIMIT 1
                )
            LEFT JOIN itenspedidos ip
                ON ip.pedidos_idpedidos = p.idpedidos
            LEFT JOIN produtos pr
                ON pr.idprodutos = ip.produtos_idprodutos
            WHERE p.numeroPedido = ?
        `;

        conexao.query(sql, [codigo], callback);
    },

    /* =========================================
       LISTAR ENTREGAS CADASTRADAS
    ========================================= */

    listarEntregas(callback) {
        const sql = `
            SELECT
                e.identregas,
                e.dataEntrega,
                e.horarioEntrega,
                e.statusEntrega,
                p.numeroPedido,
                p.datapedido,
                p.statusPedido,
                c.nome AS nomeDestinatario
            FROM entregas e
            LEFT JOIN pedidos p
                ON p.entregas_identregas = e.identregas
            LEFT JOIN cliente c
                ON c.idcliente = e.cliente_idcliente
            ORDER BY e.identregas DESC
        `;

        conexao.query(sql, callback);
    }
};

module.exports = pedidosModel;
