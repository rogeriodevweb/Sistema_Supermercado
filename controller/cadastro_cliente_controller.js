
const conexao = require("../conexao/conexao");


async function cadastrarClienteController(req, res) {
    try {
        const { nome, cpf, telefone, email, senha } = req.body;

        // Validar os campos obrigatórios
        if (!nome || !cpf || !telefone || !email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        // Verificar se o CPF já está cadastrado
        conexao.query(
            "SELECT idcliente FROM cliente WHERE cpf = ?",
            [cpf],
            async (erro, resultados) => {
                if (erro) {
                    console.error("Erro ao consultar cliente:", erro);

                    return res.status(500).json({
                        sucesso: false,
                        mensagem: "Erro ao verificar o cadastro."
                    });
                }

                if (resultados.length > 0) {
                    return res.status(409).json({
                        sucesso: false,
                        mensagem: "Este CPF já está cadastrado."
                    });
                }

                try {
                    // Criptografar a senha antes de salvar
                    const senhaCriptografada = senha;

                    const sql = `
                        INSERT INTO cliente
                        (nome, cpf, telefone, email, senha, status)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;

                    const valores = [
                        nome,
                        cpf,
                        telefone,
                        email,
                        senhaCriptografada,
                        1
                    ];

                    conexao.query(sql, valores, (erroInsert, resultado) => {
                        if (erroInsert) {
                            console.error(
                                "Erro ao cadastrar cliente:",
                                erroInsert
                            );

                            return res.status(500).json({
                                sucesso: false,
                                mensagem: "Não foi possível cadastrar o cliente."
                            });
                        }

                        return res.status(201).json({
                            sucesso: true,
                            mensagem: "Cliente cadastrado com sucesso!",
                            idcliente: resultado.insertId
                        });
                    });
                } catch (erroSenha) {
                    console.error("Erro ao criptografar senha:", erroSenha);

                    return res.status(500).json({
                        sucesso: false,
                        mensagem: "Erro ao processar a senha."
                    });
                }
            }
        );
    } catch (erro) {
        console.error("Erro no cadastro:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
}

module.exports = cadastrarClienteController;
