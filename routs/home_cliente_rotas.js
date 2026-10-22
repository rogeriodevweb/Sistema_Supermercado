
const express = require("express");
const router = express.Router();

const indexController = require("../controller/indexController");

// ==========================================
// ROTAS DA HOME DO CLIENTE
// ==========================================

// Listar todos os pedidos
router.get("/pedidos", indexController.listarPedidos);

// Listar pedidos em preparo ou a caminho
router.get("/pedidos/entrega", indexController.listarPedidosEntrega);

// Buscar pedido pelo ID
router.get("/pedidos/:id", indexController.buscarPedido);

// ==========================================
// EXPORTAR ROTAS
// ==========================================

module.exports = router;
