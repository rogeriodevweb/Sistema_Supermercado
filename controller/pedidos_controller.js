
const pedidosModel = require("../model/pedidos_model");

/* =========================================
   BUSCAR PEDIDO POR CÓDIGO
========================================= */

function buscarPorCodigo(req, res) {
    const codigo = String(req.params.codigo || "").trim();

    if (!codigo) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Informe o código do pedido."
        });
    }

    pedidosModel.listarPorCodigo(codigo, (erro, resultados) => {
        if (erro) {
            console.error("Erro ao consultar pedido:", erro);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao consultar o pedido."
            });
        }

        if (!resultados.length) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Pedido não encontrado."
            });
        }

        const pedido = resultados[0];

        const produtos = resultados
            .filter(item => item.nomeProduto !== null)
            .map(item => ({
                nome: item.nomeProduto,
                quantidade: item.quantidade,
                precoUnitario: Number(item.precoUnitario || 0),
                desconto: Number(item.desconto || 0)
            }));

        const status = String(
            pedido.statusEntrega || pedido.statusPedido || ""
        ).trim();

        const endereco = [
            pedido.rua,
            pedido.numero,
            pedido.complemento
        ].filter(Boolean).join(", ");

        return res.json({
            sucesso: true,
            numero: pedido.numeroPedido,
            status,
            previsao: pedido.dataEntrega || "",
            horarioEntrega: pedido.horarioEntrega || "",
            atualizacao: "",
            destinatario: pedido.nomeDestinatario || "",
            endereco,
            bairro: pedido.bairro || "",
            cidade: [pedido.cidade, pedido.estado]
                .filter(Boolean).join(" - "),
            cep: pedido.cep || "",
            transportadora: "",
            rastreio: "",
            tipoEnvio: "",
            produtos,
            etapas: []
        });
    });
}

/* =========================================
   LISTAR ENTREGAS CADASTRADAS
========================================= */

function listarEntregas(req, res) {
    pedidosModel.listarEntregas((erro, resultados) => {
        if (erro) {
            console.error("Erro ao listar entregas:", erro);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao consultar as entregas."
            });
        }

        return res.json({
            sucesso: true,
            total: resultados.length,
            entregas: resultados
        });
    });
}

module.exports = {
    buscarPorCodigo,
    listarEntregas
};
