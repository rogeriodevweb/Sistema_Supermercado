
/* ==========================================
   SUPERMERCADO - PRODUTOS DO CLIENTE
========================================== */

const API_PRODUTOS = "http://localhost:3000/api/produtos";

const listaProdutos = document.getElementById("listaProdutos");
const buscarProduto = document.getElementById("buscarProduto");
const mensagemProdutos = document.getElementById("mensagemProdutos");

let produtos = [];

/* ==========================================
   CARREGAR PRODUTOS
========================================== */

async function carregarProdutos() {
    listaProdutos.innerHTML = `
        <tr>
            <td colspan="6" class="mensagem-vazia">
                Carregando produtos...
            </td>
        </tr>
    `;

    try {
        const resposta = await fetch(API_PRODUTOS);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();

        if (Array.isArray(dados)) {
            produtos = dados;
        } else if (Array.isArray(dados.produtos)) {
            produtos = dados.produtos;
        } else {
            throw new Error("A API não retornou uma lista de produtos.");
        }

        renderizarProdutos();

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);

        listaProdutos.innerHTML = `
            <tr>
                <td colspan="6" class="mensagem-vazia">
                    Não foi possível carregar os produtos.
                </td>
            </tr>
        `;

        mensagemProdutos.textContent =
            "Verifique se o servidor está funcionando e se a rota de produtos existe.";
    }
}

/* ==========================================
   MOSTRAR PRODUTOS DISPONÍVEIS
========================================== */

function renderizarProdutos() {
    const termo = buscarProduto.value.trim().toLowerCase();

    const disponiveis = produtos.filter(produto => {
        const nome = String(produto.nome ?? "").toLowerCase();
        const codigo = String(produto.codigo ?? "").toLowerCase();

        return (
            Number(produto.situacao) === 1 &&
            Number(produto.estoque) > 0 &&
            (nome.includes(termo) || codigo.includes(termo))
        );
    });

    if (disponiveis.length === 0) {
        listaProdutos.innerHTML = `
            <tr>
                <td colspan="6" class="mensagem-vazia">
                    Nenhum produto disponível encontrado.
                </td>
            </tr>
        `;

        mensagemProdutos.textContent = "";
        return;
    }

    listaProdutos.innerHTML = disponiveis.map(produto => {
        const codigo = escaparHTML(produto.codigo);
        const nome = escaparHTML(produto.nome);
        const preco = formatarMoeda(produto.precoVenda);
        const estoque = Number(produto.estoque) || 0;
        const validade = escaparHTML(
            produto.validade || "Não informada"
        );

        return `
            <tr>
                <td>${codigo}</td>
                <td>${nome}</td>
                <td>${preco}</td>
                <td>${estoque}</td>
                <td>${validade}</td>
                <td>
                    <span class="status-produto status-ativo">
                        Disponível
                    </span>
                </td>
            </tr>
        `;
    }).join("");

    mensagemProdutos.textContent =
        `${disponiveis.length} produto(s) disponível(is).`;
}

/* ==========================================
   FORMATAR PREÇO
========================================== */

function formatarMoeda(valor) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return "R$ 0,00";
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/* ==========================================
   PROTEGER TEXTOS EXIBIDOS NA TABELA
========================================== */

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => {
        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entidades[caractere];
    });
}

/* ==========================================
   PESQUISAR PRODUTOS
========================================== */

buscarProduto.addEventListener("input", renderizarProdutos);

/* ==========================================
   INICIAR
========================================== */

carregarProdutos();
