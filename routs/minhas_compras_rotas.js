
const express = require("express");
const router = express.Router();

// Controller de Minhas Compras
const minhasComprasController = require("../controller/minhas_compras_controller");

// Consultar compras do cliente
router.get("/:idcliente", minhasComprasController.listarCompras);

module.exports = router;
