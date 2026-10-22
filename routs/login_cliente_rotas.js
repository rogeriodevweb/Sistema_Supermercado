const express = require("express");
const router = express.Router();

const loginClienteController = require("../controller/login_cliente_controller");

// Rota para realizar o login do cliente
router.post("/login-cliente", loginClienteController.login);

module.exports = router;