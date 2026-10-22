const perfilClienteModel = require("../model/perfil_cliente_model");

const perfilClienteController = {

    buscar: (req, res) => {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID do cliente inválido."
            });
        }

        perfilClienteModel.buscarPorId(id, (erro, resultados) => {
            if (erro) {
                console.error("Erro ao buscar perfil:", erro);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro ao consultar o perfil."
                });
            }

            if (resultados.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: "Cliente não encontrado."
                });
            }

            return res.json({
                sucesso: true,
                cliente: resultados[0]
            });
        });
    },

    atualizar: (req, res) => {
        const id = Number(req.params.id);
        const { nome, email, telefone } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID do cliente inválido."
            });
        }

        if (
            typeof nome !== "string" || !nome.trim() ||
            typeof email !== "string" || !email.trim() ||
            typeof telefone !== "string" || !telefone.trim()
        ) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Preencha nome, e-mail e telefone."
            });
        }

        perfilClienteModel.atualizar(
            id,
            {
                nome: nome.trim(),
                email: email.trim(),
                telefone: telefone.trim()
            },
            (erro, resultado) => {
                if (erro) {
                    console.error("Erro ao atualizar perfil:", erro);

                    if (erro.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            sucesso: false,
                            mensagem: "Esse e-mail já está cadastrado."
                        });
                    }

                    return res.status(500).json({
                        sucesso: false,
                        mensagem: "Erro ao atualizar o perfil."
                    });
                }

                return res.json({
                    sucesso: true,
                    mensagem: "Perfil atualizado com sucesso!"
                });
            }
        );
    }

};

module.exports = perfilClienteController;