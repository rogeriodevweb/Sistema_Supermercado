
const minhasComprasModel = require("../model/minhas_compras_model");

// Listar compras de um cliente
async function listarCompras(req, res) {
    try {
        const { idcliente } = req.params;

        if (
            !idcliente ||
            !Number.isInteger(Number(idcliente)) ||
            Number(idcliente) <= 0
        ) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID do cliente inválido."
            });
        }

        const compras = await minhasComprasModel.listarCompras(idcliente);

        return res.status(200).json({
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

module.exports = {
    listarCompras
};
