
const API = "http://localhost:3000";

let pedidos = [];
let pedidoSelecionado = null;

const cliente = JSON.parse(localStorage.getItem("cliente") || "null");
const idCliente = cliente?.id ?? cliente?.idcliente;

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    iniciarMinhasCompras();
});

async function iniciarMinhasCompras() {
    if (!cliente || !idCliente) {
        alert("Faça login para visualizar suas compras.");
        window.location.href = "login_cliente.html";
        return;
    }

    await carregarCompras();
    configurarEventos();
}

/* =========================================================
   CARREGAR COMPRAS
========================================================= */

async function carregarCompras() {
    const listaPedidos = document.getElementById("listaPedidos");
    const mensagemVazia = document.getElementById("mensagemVazia");

    try {
        const resposta = await fetch(
            `${API}/minhas-compras/${encodeURIComponent(idCliente)}`
        );

        const dados = await resposta.json();

        if (!resposta.ok || dados.sucesso === false) {
            throw new Error(dados.mensagem || "Erro ao carregar compras.");
        }

        pedidos = Array.isArray(dados.compras)
            ? dados.compras
            : Array.isArray(dados.pedidos)
                ? dados.pedidos
                : Array.isArray(dados.dados)
                    ? dados.dados
                    : Array.isArray(dados)
                        ? dados
                        : [];

        renderizarCompras();

    } catch (erro) {
        console.error("Erro ao carregar compras:", erro);

        if (listaPedidos) {
            listaPedidos.innerHTML = `
                <p class="mensagem-erro">
                    Não foi possível carregar suas compras.
                </p>
            `;
        }

        if (mensagemVazia) {
            mensagemVazia.hidden = true;
        }
    }
}

/* =========================================================
   RENDERIZAR HISTÓRICO DE COMPRAS
========================================================= */

function renderizarCompras() {
    const listaPedidos = document.getElementById("listaPedidos");
    const mensagemVazia = document.getElementById("mensagemVazia");
    const totalPedidos = document.getElementById("totalPedidos");

    if (!listaPedidos) return;

    listaPedidos.innerHTML = "";

    if (totalPedidos) {
        totalPedidos.textContent = pedidos.length;
    }

    if (pedidos.length === 0) {
        if (mensagemVazia) {
            mensagemVazia.hidden = false;
        }
        return;
    }

    if (mensagemVazia) {
        mensagemVazia.hidden = true;
    }

    pedidos.forEach(pedido => {
        const id = pedido.idpedidos ?? pedido.id;
        const numero = pedido.numeroPedido ?? `#${id}`;
        const data = formatarData(pedido.datapedido);
        const status = pedido.statusPedido ?? "Em processamento";
        const total = calcularTotal(pedido);

        const card = document.createElement("div");
        card.className = "pedido-card";

        card.innerHTML = `
            <div class="pedido-info">
                <h3>Pedido ${numero}</h3>

                <p>
                    <strong>Data:</strong> ${data}
                </p>

                <p>
                    <strong>Status:</strong> ${status}
                </p>

                <p>
                    <strong>Total:</strong> ${formatarMoeda(total)}
                </p>
            </div>

            <button
                type="button"
                class="btn-detalhes"
                data-id="${id}"
            >
                Ver detalhes
            </button>
        `;

        card.querySelector(".btn-detalhes").addEventListener("click", () => {
            carregarDetalhes(id);
        });

        listaPedidos.appendChild(card);
    });
}

/* =========================================================
   CARREGAR DETALHES DO PEDIDO
========================================================= */

async function carregarDetalhes(idPedido) {
    try {
        const resposta = await fetch(
            `${API}/minhas-compras/${encodeURIComponent(idCliente)}/${encodeURIComponent(idPedido)}`
        );

        const dados = await resposta.json();

        if (!resposta.ok || dados.sucesso === false) {
            throw new Error(dados.mensagem || "Erro ao carregar detalhes.");
        }

        pedidoSelecionado =
            dados.compra ?? dados.pedido ?? dados.dados ?? dados;

        exibirDetalhes(pedidoSelecionado);

    } catch (erro) {
        console.error("Erro ao carregar detalhes:", erro);

        alert("Não foi possível carregar os detalhes deste pedido.");
    }
}

/* =========================================================
   EXIBIR DETALHES DO PEDIDO
========================================================= */

function exibirDetalhes(pedido) {
    const detalhesPedido = document.getElementById("detalhesPedido");

    if (!detalhesPedido) return;

    const itens = Array.isArray(pedido.itens) ? pedido.itens : [];

    const detalheNomeProduto =
        document.getElementById("detalheNomeProduto");

    const detalheCodigo =
        document.getElementById("detalheCodigo");

    const detalheData =
        document.getElementById("detalheData");

    const detalheStatus =
        document.getElementById("detalheStatus");

    const detalheValor =
        document.getElementById("detalheValor");

    /* -----------------------------------------
       PRODUTOS EM CARDS INDIVIDUAIS
    ----------------------------------------- */

    if (detalheNomeProduto) {
        detalheNomeProduto.innerHTML = "";

        if (itens.length === 0) {
            detalheNomeProduto.textContent =
                "Nenhum produto encontrado.";
        } else {
            itens.forEach(item => {
                const quantidade = Number(item.quantidade || 0);
                const preco = Number(item.precoUnitario || 0);
                const desconto = Number(item.desconto || 0);

                const subtotal = Number(
                    item.totalItem ??
                    Math.max(0, quantidade * preco - desconto)
                );

                const card = document.createElement("div");
                card.className = "item-detalhe";

                const nome = document.createElement("h4");
                nome.textContent =
                    item.nomeProduto ?? item.nome ?? "Produto";

                const codigo = document.createElement("span");
                codigo.className = "item-codigo";

                codigo.textContent = item.codigoProduto
                    ? `Código: ${item.codigoProduto}`
                    : "Produto";

                const quantidadeTexto = document.createElement("span");
                quantidadeTexto.className = "item-quantidade";

                quantidadeTexto.textContent =
                    `Quantidade: ${quantidade}`;

                const precoTexto = document.createElement("strong");
                precoTexto.className = "item-preco";
                precoTexto.textContent = formatarMoeda(subtotal);

                const informacoes = document.createElement("div");
                informacoes.className = "item-informacoes";

                informacoes.append(
                    codigo,
                    quantidadeTexto
                );

                card.append(
                    nome,
                    informacoes,
                    precoTexto
                );

                detalheNomeProduto.appendChild(card);
            });
        }
    }

    /* -----------------------------------------
       INFORMAÇÕES GERAIS DO PEDIDO
    ----------------------------------------- */

    if (detalheCodigo) {
        detalheCodigo.textContent =
            pedido.numeroPedido ?? pedido.idpedidos ?? "-";
    }

    if (detalheData) {
        detalheData.textContent =
            formatarData(pedido.datapedido);
    }

    if (detalheStatus) {
        detalheStatus.textContent =
            pedido.statusPedido ?? "-";
    }

    if (detalheValor) {
        detalheValor.textContent =
            formatarMoeda(calcularTotal(pedido));
    }

    /* -----------------------------------------
       MOSTRAR SEÇÃO DE DETALHES
    ----------------------------------------- */

    detalhesPedido.hidden = false;

    detalhesPedido.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================================================
   CALCULAR TOTAL DO PEDIDO
========================================================= */

function calcularTotal(pedido) {
    if (
        pedido.valorTotal !== undefined &&
        pedido.valorTotal !== null
    ) {
        return Number(pedido.valorTotal);
    }

    const itens = Array.isArray(pedido.itens)
        ? pedido.itens
        : [];

    return itens.reduce((total, item) => {
        const quantidade = Number(item.quantidade || 0);
        const preco = Number(item.precoUnitario || 0);
        const desconto = Number(item.desconto || 0);

        return total + Math.max(
            0,
            quantidade * preco - desconto
        );
    }, 0);
}

/* =========================================================
   FORMATAR MOEDA
========================================================= */

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarData(data) {
    if (!data) return "-";

    const dataTexto = String(data);

    // Corrige datas no formato DD/MM/AAAA
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataTexto)) {
        return dataTexto;
    }

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return dataTexto;
    }

    return dataConvertida.toLocaleDateString("pt-BR");
}

/* =========================================================
   CONFIGURAR EVENTOS
========================================================= */

function configurarEventos() {
    const pesquisaPedido =
        document.getElementById("pesquisaPedido");

    const filtroStatus =
        document.getElementById("filtroStatus");

    const fecharDetalhes =
        document.getElementById("fecharDetalhes");

    const detalhesPedido =
        document.getElementById("detalhesPedido");

    const botaoAcompanhar =
        document.getElementById("botaoAcompanhar");

    if (pesquisaPedido) {
        pesquisaPedido.addEventListener("input", aplicarFiltros);
    }

    if (filtroStatus) {
        filtroStatus.addEventListener("change", aplicarFiltros);
    }

    if (fecharDetalhes && detalhesPedido) {
        fecharDetalhes.addEventListener("click", () => {
            detalhesPedido.hidden = true;
            pedidoSelecionado = null;
        });
    }

    // Redirecionar para a página de acompanhamento
    if (botaoAcompanhar) {
        botaoAcompanhar.addEventListener("click", () => {
            window.location.href = "acompanhar_entrega.html";
        });
    }
}

/* =========================================================
   PESQUISAR E FILTRAR PEDIDOS
========================================================= */

function aplicarFiltros() {
    const pesquisaPedido =
        document.getElementById("pesquisaPedido");

    const filtroStatus =
        document.getElementById("filtroStatus");

    const pesquisa =
        pesquisaPedido?.value.toLowerCase().trim() || "";

    const statusFiltro =
        filtroStatus?.value || "";

    const filtrados = pedidos.filter(pedido => {
        const numero = String(
            pedido.numeroPedido ?? pedido.idpedidos ?? ""
        );

        const status = String(
            pedido.statusPedido ?? ""
        );

        const correspondePesquisa =
            numero.toLowerCase().includes(pesquisa);

        const correspondeStatus =
            !statusFiltro ||
            status.toLowerCase() === statusFiltro.toLowerCase();

        return correspondePesquisa && correspondeStatus;
    });

    const listaPedidos =
        document.getElementById("listaPedidos");

    if (!listaPedidos) return;

    listaPedidos.innerHTML = "";

    filtrados.forEach(pedido => {
        const id = pedido.idpedidos ?? pedido.id;

        const card = document.createElement("div");
        card.className = "pedido-card";

        card.innerHTML = `
            <div class="pedido-info">
                <h3>Pedido ${pedido.numeroPedido ?? `#${id}`}</h3>

                <p>
                    <strong>Data:</strong>
                    ${formatarData(pedido.datapedido)}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${pedido.statusPedido ?? "Em processamento"}
                </p>

                <p>
                    <strong>Total:</strong>
                    ${formatarMoeda(calcularTotal(pedido))}
                </p>
            </div>

            <button
                type="button"
                class="btn-detalhes"
                data-id="${id}"
            >
                Ver detalhes
            </button>
        `;

        card.querySelector(".btn-detalhes").addEventListener("click", () => {
            carregarDetalhes(id);
        });

        listaPedidos.appendChild(card);
    });
}
