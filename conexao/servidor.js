
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORTA = 3000;

/* =========================================
   CONFIGURAÇÕES
========================================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================
   CONEXÃO COM O BANCO DE DADOS
========================================= */

const conexao = require("./conexao");
app.locals.conexao = conexao;

/* =========================================
   ARQUIVOS ESTÁTICOS
========================================= */

app.use(express.static(path.join(__dirname, "..")));

/* =========================================
   CONTROLLERS
========================================= */

const cadastroClienteController = require("../controller/cadastro_cliente_controller");
const loginClienteController = require("../controller/login_cliente_controller");
const perfilClienteController = require("../controller/perfil_cliente_controller");

/* =========================================
   CADASTRO DO CLIENTE
========================================= */

app.post("/cadastro", (req, res) => {
    console.log("POST /cadastro recebido");
    cadastroClienteController(req, res);
});

/* =========================================
   LOGIN DO CLIENTE
========================================= */

app.post("/login", (req, res) => {
    console.log("POST /login recebido");
    loginClienteController.login(req, res);
});

/* =========================================
   PERFIL DO CLIENTE
========================================= */

app.get("/perfil/:id", (req, res) => {
    perfilClienteController.buscar(req, res);
});

app.put("/perfil/:id", (req, res) => {
    perfilClienteController.atualizar(req, res);
});

/* =========================================
   ROTA DE TESTE
========================================= */

app.post("/teste-rota", (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "A rota POST está funcionando!"
    });
});

/* =========================================
   STATUS DO SERVIDOR
========================================= */

app.get("/api/status", (req, res) => {
    res.json({
        servidor: "online",
        mensagem: "Sistema Supermercado funcionando!"
    });
});
/* =========================================
   ROTAS - MEU PERFIL
========================================= */

app.get("/perfil/:id", (req, res) => {
    perfilClienteController.buscar(req, res);
});

app.put("/perfil/:id", (req, res) => {
    perfilClienteController.atualizar(req, res);
});
/* =========================================
   INICIAR SERVIDOR
========================================= */
/* =========================================
   SALVAR / ATUALIZAR ENDEREÇO DO CLIENTE
========================================= */

app.post("/endereco", (req, res) => {
    const {
        cliente_idcliente,
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado
    } = req.body;

    if (
        !cliente_idcliente ||
        !cep?.trim() ||
        !rua?.trim() ||
        !numero?.trim() ||
        !bairro?.trim() ||
        !cidade?.trim() ||
        !estado?.trim()
    ) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Preencha todos os campos obrigatórios."
        });
    }

    const idCliente = Number(cliente_idcliente);

    if (!Number.isInteger(idCliente) || idCliente <= 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "ID do cliente inválido."
        });
    }

    // Confirma que o cliente existe
    conexao.query(
        "SELECT idcliente FROM cliente WHERE idcliente = ?",
        [idCliente],
        (erro, resultados) => {
            if (erro) {
                console.error("Erro ao consultar cliente:", erro);
                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro ao consultar o cliente."
                });
            }

            if (resultados.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: "Cliente não encontrado."
                });
            }

            // Verifica se o cliente já possui endereço
            conexao.query(
                "SELECT idEndereco FROM endereco WHERE cliente_idcliente = ? LIMIT 1",
                [idCliente],
                (erroBusca, enderecos) => {
                    if (erroBusca) {
                        console.error("Erro ao consultar endereço:", erroBusca);
                        return res.status(500).json({
                            sucesso: false,
                            mensagem: "Erro ao consultar o endereço."
                        });
                    }

                    const valores = [
                        bairro.trim(),
                        cep.trim(),
                        cidade.trim(),
                        estado.trim(),
                        rua.trim(),
                        numero.trim(),
                        complemento?.trim() || null
                    ];

                    if (enderecos.length > 0) {
                        // Atualiza o endereço existente
                        const sql = `
                            UPDATE endereco
                            SET bairro = ?,
                                cep = ?,
                                cidade = ?,
                                estado = ?,
                                rua = ?,
                                numero = ?,
                                complemento = ?
                            WHERE idEndereco = ?
                        `;

                        conexao.query(
                            sql,
                            [...valores, enderecos[0].idEndereco],
                            (erroAtualizar) => {
                                if (erroAtualizar) {
                                    console.error("Erro ao atualizar endereço:", erroAtualizar);
                                    return res.status(500).json({
                                        sucesso: false,
                                        mensagem: "Não foi possível atualizar o endereço."
                                    });
                                }

                                return res.json({
                                    sucesso: true,
                                    mensagem: "Endereço atualizado com sucesso!"
                                });
                            }
                        );
                    } else {
                        // Cadastra o primeiro endereço do cliente
                        const sql = `
                            INSERT INTO endereco
                            (
                                bairro,
                                cep,
                                cidade,
                                estado,
                                rua,
                                numero,
                                complemento,
                                cliente_idcliente
                            )
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        `;

                        conexao.query(
                            sql,
                            [...valores, idCliente],
                            (erroInserir) => {
                                if (erroInserir) {
                                    console.error("Erro ao salvar endereço:", erroInserir);
                                    return res.status(500).json({
                                        sucesso: false,
                                        mensagem: "Não foi possível salvar o endereço."
                                    });
                                }

                                return res.status(201).json({
                                    sucesso: true,
                                    mensagem: "Endereço salvo com sucesso!"
                                });
                            }
                        );
                    }
                }
            );
        }
    );
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
    console.log("Rota POST /cadastro registrada");
    console.log("Rota POST /login registrada");
    console.log("Rota GET /perfil/:id registrada");
    console.log("Rota PUT /perfil/:id registrada");
});
