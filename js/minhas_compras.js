const API = "http://localhost:3000";

let pedidos = [];
let pedidoSelecionado = null;

const cliente = JSON.parse(localStorage.getItem("cliente") || "null");
const idCliente = cliente?.id ?? cliente?.idcliente;

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
            mensagemVazia.style.display = "none";
        }
    }
}

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
            mensagemVazia.style.display = "block";
        }
        return;
    }

    if (mensagemVazia) {
        mensagemVazia.style.display = "none";
    }

    pedidos.forEach((pedido) => {
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
                <p><strong>Data:</strong> ${data}</p>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Total:</strong> ${formatarMoeda(total)}</p>
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

async function carregarDetalhes(idPedido) {
    try {
        const resposta = await fetch(
            `${API}/minhas-compras/${encodeURIComponent(idCliente)}/${encodeURIComponent(idPedido)}`
        );

        const dados = await resposta.json();

        if (!resposta.ok || dados.sucesso === false) {
            throw new Error(dados.mensagem || "Erro ao carregar detalhes.");
        }

        pedidoSelecionado = dados.compra ?? dados.pedido ?? dados.dados ?? dados;

        exibirDetalhes(pedidoSelecionado);

    } catch (erro) {
        console.error("Erro ao carregar detalhes:", erro);
        alert("Não foi possível carregar os detalhes deste pedido.");
    }
}

function exibirDetalhes(pedido) {
    const detalhesPedido = document.getElementById("detalhesPedido");

    if (!detalhesPedido) return;

    const itens = Array.isArray(pedido.itens) ? pedido.itens : [];

    const detalheNomeProduto = document.getElementById("detalheNomeProduto");
    const detalheCodigo = document.getElementById("detalheCodigo");
    const detalheData = document.getElementById("detalheData");
    const detalheStatus = document.getElementById("detalheStatus");
    const detalheValor = document.getElementById("detalheValor");

    if (detalheNomeProduto) {
        detalheNomeProduto.textContent = itens.length
            ? itens.map(item => {
                const quantidade = Number(item.quantidade || 0);
                const preco = Number(item.precoUnitario || 0);
                const desconto = Number(item.desconto || 0);
                const subtotal = Number(
                    item.subtotal ?? Math.max(0, quantidade * preco - desconto)
                );

                return `${item.nomeProduto ?? item.nome ?? "Produto"} — Qtd.: ${quantidade} — ${formatarMoeda(subtotal)}`;
            }).join(" | ")
            : "Nenhum produto encontrado.";
    }

    if (detalheCodigo) {
        detalheCodigo.textContent = pedido.numeroPedido ?? pedido.idpedidos ?? "-";
    }

    if (detalheData) {
        detalheData.textContent = formatarData(pedido.datapedido);
    }

    if (detalheStatus) {
        detalheStatus.textContent = pedido.statusPedido ?? "-";
    }

    if (detalheValor) {
        detalheValor.textContent = formatarMoeda(calcularTotal(pedido));
    }

    detalhesPedido.style.display = "block";
    detalhesPedido.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function calcularTotal(pedido) {
    if (pedido.valorTotal !== undefined && pedido.valorTotal !== null) {
        return Number(pedido.valorTotal);
    }

    const itens = Array.isArray(pedido.itens) ? pedido.itens : [];

    return itens.reduce((total, item) => {
        const quantidade = Number(item.quantidade || 0);
        const preco = Number(item.precoUnitario || 0);
        const desconto = Number(item.desconto || 0);

        return total + Math.max(0, quantidade * preco - desconto);
    }, 0);
}

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(data) {
    if (!data) return "-";

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return data;
    }

    return dataConvertida.toLocaleDateString("pt-BR");
}

function configurarEventos() {
    const pesquisaPedido = document.getElementById("pesquisaPedido");
    const filtroStatus = document.getElementById("filtroStatus");

    if (pesquisaPedido) {
        pesquisaPedido.addEventListener("input", aplicarFiltros);
    }

    if (filtroStatus) {
        filtroStatus.addEventListener("change", aplicarFiltros);
    }
}

function aplicarFiltros() {
    const pesquisaPedido = document.getElementById("pesquisaPedido");
    const filtroStatus = document.getElementById("filtroStatus");

    const pesquisa = pesquisaPedido?.value.toLowerCase().trim() || "";
    const statusFiltro = filtroStatus?.value || "";

    const filtrados = pedidos.filter(pedido => {
        const numero = String(pedido.numeroPedido ?? pedido.idpedidos ?? "");
        const status = String(pedido.statusPedido ?? "");

        const correspondePesquisa = numero.toLowerCase().includes(pesquisa);
        const correspondeStatus = !statusFiltro || status === statusFiltro;

        return correspondePesquisa && correspondeStatus;
    });

    const listaPedidos = document.getElementById("listaPedidos");

    if (!listaPedidos) return;

    listaPedidos.innerHTML = "";

    filtrados.forEach(pedido => {
        const id = pedido.idpedidos ?? pedido.id;

        const card = document.createElement("div");
        card.className = "pedido-card";

        card.innerHTML = `
            <div class="pedido-info">
                <h3>Pedido ${pedido.numeroPedido ?? `#${id}`}</h3>
                <p><strong>Data:</strong> ${formatarData(pedido.datapedido)}</p>
                <p><strong>Status:</strong> ${pedido.statusPedido ?? "Em processamento"}</p>
                <p><strong>Total:</strong> ${formatarMoeda(calcularTotal(pedido))}</p>
            </div>

            <button type="button" class="btn-detalhes">
                Ver detalhes
            </button>
        `;

        card.querySelector(".btn-detalhes").addEventListener("click", () => {
            carregarDetalhes(id);
        });

        listaPedidos.appendChild(card);
    });
}