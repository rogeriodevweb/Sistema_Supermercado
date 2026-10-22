
const express = require("express");
const router = express.Router();

const CadastroClienteController = require("../controller/cadastro_cliente_controller.js");

// Rota para cadastrar cliente
router.post(
    "/cadastro",
    CadastroClienteController.cadastrar
);

module.exports = router;
