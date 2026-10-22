
const loginClienteModel = require("../model/login_cliente_model");
const bcrypt = require("bcrypt");

const loginClienteController = {
    login: (req, res) => {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "E-mail e senha são obrigatórios."
            });
        }

        loginClienteModel.buscarCliente(email, async (erro, clientes) => {
            if (erro) {
                console.error("Erro ao realizar login:", erro);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro interno do servidor."
                });
            }

            if (clientes.length === 0) {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: "E-mail ou senha incorretos."
                });
            }

            const cliente = clientes[0];

            try {
                const senhaCorreta = await bcrypt.compare(
                    senha,
                    cliente.senha
                );

                if (!senhaCorreta) {
                    return res.status(401).json({
                        sucesso: false,
                        mensagem: "E-mail ou senha incorretos."
                    });
                }

                return res.status(200).json({
                    sucesso: true,
                    mensagem: "Login realizado com sucesso!",
                    cliente: {
                        id: cliente.idcliente,
                        nome: cliente.nome,
                        email: cliente.email
                    }
                });
            } catch (erroSenha) {
                console.error("Erro ao verificar senha:", erroSenha);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro ao verificar a senha."
                });
            }
        });
    }
};

module.exports = loginClienteController;
