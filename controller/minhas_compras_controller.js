
const minhasComprasModel = require("../model/minhas_compras_model");

async function listarCompras(req, res) {
    try {
        const idcliente = Number(req.params.idcliente);

        if (!Number.isInteger(idcliente) || idcliente <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID do cliente inválido."
            });
        }

        const compras = await minhasComprasModel.listarCompras(idcliente);

        return res.json({
            sucesso: true,
            total: compras.length,
            compras
        });
    } catch (erro) {
        console.error("Erro ao listar compras:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao consultar as compras."
        });
    }
}

async function buscarDetalhes(req, res) {
    try {
        const idcliente = Number(req.params.idcliente);
        const idpedido = Number(req.params.idpedido);

        if (
            !Number.isInteger(idcliente) || idcliente <= 0 ||
            !Number.isInteger(idpedido) || idpedido <= 0
        ) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID do cliente ou pedido inválido."
            });
        }

        const pedido = await minhasComprasModel.buscarDetalhes(
            idcliente,
            idpedido
        );

        if (!pedido) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Pedido não encontrado para este cliente."
            });
        }

        return res.json({ sucesso: true, pedido });
    } catch (erro) {
        console.error("Erro ao consultar detalhes:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao consultar os detalhes do pedido."
        });
    }
}

module.exports = {
    listarCompras,
    buscarDetalhes
};

