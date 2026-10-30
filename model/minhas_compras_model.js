
const db = require("../conexao/conexao");

const sqlBase = `
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
`;

function agruparPedidos(linhas) {
    const mapa = new Map();

    for (const linha of linhas) {
        let pedido = mapa.get(linha.idpedidos);

        if (!pedido) {
            pedido = {
                idpedidos: linha.idpedidos,
                numeroPedido: linha.numeroPedido,
                datapedido: linha.datapedido,
                statusPedido: linha.statusPedido,
                observacao: linha.observacao,
                valorTotal: 0,
                itens: []
            };

            mapa.set(linha.idpedidos, pedido);
        }

        if (linha.iditensPedidos != null) {
            const quantidade = Number(linha.quantidade || 0);
            const precoUnitario = Number(linha.precoUnitario || 0);
            const desconto = Number(linha.desconto || 0);

            const totalItem = Math.max(
                0,
                quantidade * precoUnitario - desconto
            );

            pedido.itens.push({
                iditensPedidos: linha.iditensPedidos,
                idprodutos: linha.idprodutos,
                nomeProduto: linha.nomeProduto || "Produto",
                codigoProduto: linha.codigoProduto,
                quantidade,
                precoUnitario,
                desconto,
                totalItem
            });

            pedido.valorTotal += totalItem;
        }
    }

    return Array.from(mapa.values());
}

async function listarCompras(idcliente) {
    const sql = `
        ${sqlBase}
        WHERE p.cliente_idcliente = ?
        ORDER BY p.idpedidos DESC, ip.iditensPedidos ASC
    `;

    console.log("ID recebido pelo model:", idcliente);

const [banco] = await db.promise().query(
    "SELECT DATABASE() AS banco"
);
const [diagnostico] = await db.promise().query(`
    SELECT
        @@server_uuid AS servidor_uuid,
        @@datadir AS diretorio_dados
`);

const [total] = await db.promise().query(`
    SELECT COUNT(*) AS total_pedidos
    FROM supermercado.pedidos
`);

console.log("IDENTIFICAÇÃO DO MYSQL:", diagnostico);
console.log("TOTAL DE PEDIDOS NO NODE:", total);

console.log("Banco utilizado:", banco[0].banco);

const [teste] = await db.promise().query(
    "SELECT * FROM supermercado.pedidos WHERE idpedidos = 1"
);

console.log("TESTE DO PEDIDO:", teste);

console.log("Pedidos encontrados:", teste);

const [info] = await db.promise().query(`
    SELECT
        @@hostname AS servidor,
        @@port AS porta,
        DATABASE() AS banco,
        CURRENT_USER() AS usuario
`);

console.log("CONEXÃO NODE.JS:", info);
const [linhas] = await db.promise().execute(sql, [idcliente]);

console.log("Linhas retornadas pela consulta:", linhas.length);
console.log(linhas);

return agruparPedidos(linhas);
}

async function buscarDetalhes(idcliente, idpedido) {
    const sql = `
        ${sqlBase}
        WHERE p.cliente_idcliente = ?
          AND p.idpedidos = ?
        ORDER BY ip.iditensPedidos ASC
    `;

    const [linhas] = await db.promise().execute(sql, [idcliente, idpedido]);
    const pedidos = agruparPedidos(linhas);

    return pedidos[0] || null;
}

module.exports = {
    listarCompras,
    buscarDetalhes
};
