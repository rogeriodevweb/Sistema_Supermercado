
const loginClienteModel = require("../model/login_cliente_model");

const loginClienteController = {
    login: (req, res) => {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "E-mail e senha são obrigatórios."
            });
        }

        loginClienteModel.buscarCliente(email, (erro, clientes) => {
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

            // Comparar a senha diretamente com a salva no banco
            if (senha !== cliente.senha) {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: "E-mail ou senha incorretos."
                });
            }

            // Verificar se o cliente está ativo
            if (Number(cliente.status) !== 1) {
                return res.status(403).json({
                    sucesso: false,
                    mensagem: "Cliente inativo. Entre em contato com o suporte."
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
        });
    }
};

module.exports = loginClienteController;
