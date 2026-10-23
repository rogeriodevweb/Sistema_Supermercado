
const express = require("express");
const router = express.Router();

const indexController = require("../controller/home_cliente_controller");

// ==========================================
// ROTAS DA HOME DO CLIENTE
// ==========================================

// Listar compras do cliente
router.get(
    "/clientes/:clienteId/pedidos",
    indexController.listarPedidos
);

// Listar compras em preparo ou a caminho
router.get(
    "/clientes/:clienteId/pedidos/entrega",
    indexController.listarPedidosEntrega
);

// Buscar detalhes de uma compra específica
router.get(
    "/clientes/:clienteId/pedidos/:id",
    indexController.buscarPedido
);

module.exports = router;
