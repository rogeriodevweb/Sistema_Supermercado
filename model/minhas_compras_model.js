
const db = require("../conexao/conexao");

// Listar pedidos e produtos de um cliente
async function listarCompras(idcliente) {
    const sql = `
        SELECT
            p.idpedidos,
            p.numeroPedido,
            p.datapedido,
            p.statusPedido,
            p.observacao,

            ip.iditensPedidos,
            ip.quantidade,
            ip.precoUnitario,
            ip.desconto,

            pr.idprodutos,
            pr.nome AS nomeProduto,
            pr.codigo AS codigoProduto

        FROM pedidos p

        LEFT JOIN itenspedidos ip
            ON ip.pedidos_idpedidos = p.idpedidos

        LEFT JOIN produtos pr
            ON pr.idprodutos = ip.produtos_idprodutos

        WHERE p.cliente_idcliente = ?

        ORDER BY p.idpedidos DESC, ip.iditensPedidos ASC
    `;

    const [resultado] = await db.execute(sql, [idcliente]);

    return resultado;
}

module.exports = {
    listarCompras
};
