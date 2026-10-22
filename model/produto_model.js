const conexao = require("../conexao/conexao");

const produtoModel = {

    listarTodos: (callback) => {
        const sql = `
            SELECT
                idprodutos,
                nome,
                codigo,
                descricao,
                precoVenda,
                situacao,
                estoque,
                validade,
                categorias_idcategorias,
                marcas_idmarcas,
                unidadeMedidas_idunidadeMedidas
            FROM produtos
            ORDER BY nome ASC
        `;

        conexao.query(sql, callback);
    }

};

module.exports = produtoModel;
