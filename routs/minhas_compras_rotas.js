
const express = require("express");
const router = express.Router();

const minhasComprasController = require("../controller/minhas_compras_controller");

// Listar compras do cliente
router.get("/:idcliente", minhasComprasController.listarCompras);

// Consultar detalhes de um pedido específico
router.get(
    "/:idcliente/:idpedido",
    minhasComprasController.buscarDetalhes
);

module.exports = router;
