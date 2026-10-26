
const express = require("express");
const router = express.Router();

const pedidosController = require("../controller/pedidos_controller");

// Listar todas as entregas
router.get("/entregas/listar", pedidosController.listarEntregas);

// Consultar um pedido específico
router.get("/:codigo", pedidosController.buscarPorCodigo);

module.exports = router;
