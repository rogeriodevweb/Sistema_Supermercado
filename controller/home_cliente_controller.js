const indexModel = require("../model/home_cliente_model.js");

const indexController = {

    inicio: (req, res) => {

        res.status(200).json({
            mensagem: "Sistema do supermercado funcionando."
        });
    },

    listarPedidos: (req, res) => {

        indexModel.listarPedidos((erro, pedidos) => {

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

        indexModel.listarPedidosEntrega((erro, pedidos) => {

            if (erro) {

                console.error(
                    "Erro ao buscar pedidos para entrega:",
                    erro
                );

                return res.status(500).json({
                    erro: "Erro ao buscar pedidos para entrega."
                });
            }

            res.status(200).json(pedidos);
        });
    },

    buscarPedido: (req, res) => {

        const { id } = req.params;

        indexModel.buscarPedido(id, (erro, pedido) => {

            if (erro) {

                console.error("Erro ao buscar pedido:", erro);

                return res.status(500).json({
                    erro: "Erro ao buscar o pedido."
                });
            }

            if (pedido.length === 0) {

                return res.status(404).json({
                    erro: "Pedido não encontrado."
                });
            }

            res.status(200).json(pedido[0]);
        });
    }
};

module.exports = indexController;