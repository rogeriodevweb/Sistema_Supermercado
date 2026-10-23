
const indexModel = require("../model/home_cliente_model.js");

const indexController = {
    inicio: (req, res) => {
        res.status(200).json({
            mensagem: "Sistema do supermercado funcionando."
        });
    },

    listarPedidos: (req, res) => {
        const clienteId = Number(req.params.clienteId);

        if (!Number.isInteger(clienteId) || clienteId <= 0) {
            return res.status(400).json({
                erro: "ID do cliente inválido."
            });
        }

        indexModel.listarPedidos(clienteId, (erro, pedidos) => {
            if (erro) {
                console.error("Erro ao buscar pedidos:", erro);
                return res.status(500).json({
                    erro: "Erro ao buscar os pedidos."
                });
            }

            res.status(200).json(pedidos);
        });
    },

    listarPedidosEntrega: (req, res) => {
        const clienteId = Number(req.params.clienteId);

        if (!Number.isInteger(clienteId) || clienteId <= 0) {
            return res.status(400).json({
                erro: "ID do cliente inválido."
            });
        }

        indexModel.listarPedidosEntrega(clienteId, (erro, pedidos) => {
            if (erro) {
                console.error("Erro ao buscar pedidos para entrega:", erro);
                return res.status(500).json({
                    erro: "Erro ao buscar pedidos para entrega."
                });
            }

            res.status(200).json(pedidos);
        });
    },

    buscarPedido: (req, res) => {
        const clienteId = Number(req.params.clienteId);
        const pedidoId = Number(req.params.id);

        if (
            !Number.isInteger(clienteId) || clienteId <= 0 ||
            !Number.isInteger(pedidoId) || pedidoId <= 0
        ) {
            return res.status(400).json({
                erro: "ID do cliente ou do pedido inválido."
            });
        }

        indexModel.buscarPedido(
            pedidoId,
            clienteId,
            (erro, pedidos) => {
                if (erro) {
                    console.error("Erro ao buscar pedido:", erro);
                    return res.status(500).json({
                        erro: "Erro ao buscar o pedido."
                    });
                }

                if (pedidos.length === 0) {
                    return res.status(404).json({
                        erro: "Pedido não encontrado."
                    });
                }

                res.status(200).json(pedidos[0]);
            }
        );
    }
};

module.exports = indexController;
