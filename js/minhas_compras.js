/* =========================================
   MINHAS COMPRAS
   Sistema_Supermercado
========================================= */

const API = "http://localhost:3000";

const listaPedidos = document.getElementById("listaPedidos");
const mensagemVazia = document.getElementById("mensagemVazia");
const totalPedidos = document.getElementById("totalPedidos");
const pesquisaPedido = document.getElementById("pesquisaPedido");
const filtroStatus = document.getElementById("filtroStatus");

const detalhesPedido = document.getElementById("detalhesPedido");
const botaoFechar = document.getElementById("fecharDetalhes");
const botaoAcompanhar = document.getElementById("botaoAcompanhar");
const botaoVoltar = document.getElementById("botaoVoltar");
const botaoUsuario = document.getElementById("botaoUsuario");

let pedidos = [];
let pedidoSelecionado = null;

/* =========================================
   CLIENTE LOGADO
========================================= */

function obterClienteLogado() {
    try {
        const dados = localStorage.getItem("cliente");

        if (!dados) {
            return null;
        }

        return JSON.parse(dados);
    } catch (erro) {
        console.error("Erro ao ler cliente:", erro);
        return null;
    }
}

const cliente = obterClienteLogado();

/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    if (!cliente || !cliente.id) {
        listaPedidos.innerHTML = "";

        mensagemVazia.hidden = false;
        mensagemVazia.querySelector("h3").textContent =
            "Faça login para consultar suas compras.";

        mensagemVazia.querySelector("p").textContent =
            "Entre na sua conta para visualizar seus pedidos.";

        return;
    }

    carregarPedidos();
});

/* =========================================
   BUSCAR PEDIDOS DA API
========================================= */

async function carregarPedidos() {
    listaPedidos.innerHTML = `
        <div class="mensagem-carregamento">
            Carregando seus pedidos...
        </div>
    `;

    mensagemVazia.hidden = true;

    try {
        const resposta = await fetch(
            `${API}/clientes/${encodeURIComponent(cliente.id)}/pedidos`
        );

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        // Aceita uma lista direta ou uma lista dentro de uma propriedade.
        if (Array.isArray(dados)) {
            pedidos = dados;
        } else if (Array.isArray(dados.pedidos)) {
            pedidos = dados.pedidos;
        } else if (Array.isArray(dados.dados)) {
            pedidos = dados.dados;
        } else {
            throw new Error(
                dados.mensagem || "Formato de resposta dos pedidos inválido."
            );
        }

        renderizarPedidos();

    } catch (erro) {
        console.error("Erro ao carregar compras:", erro);

        listaPedidos.innerHTML = `
            <div class="mensagem-carregamento">
                Não foi possível carregar seus pedidos.
                Verifique se o servidor está funcionando.
                <br><br>
                <button class="botao-principal"
                        type="button"
                        onclick="carregarPedidos()">
                    Tentar novamente
                </button>
            </div>
        `;
    }
}

/* =========================================
   NORMALIZAR STATUS
========================================= */

function normalizarStatus(status) {
    const texto = String(status || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    if (texto.includes("cancel")) {
        return "cancelado";
    }

    if (texto.includes("entreg")) {
        return "entregue";
    }

    if (
        texto.includes("transport") ||
        texto.includes("caminho")
    ) {
        return "transporte";
    }

    if (
        texto.includes("prepar") ||
        texto.includes("separ")
    ) {
        return "preparando";
    }

    if (
        texto.includes("confirm") ||
        texto.includes("pago")
    ) {
        return "confirmado";
    }

    if (
        texto.includes("pend") ||
        texto.includes("aguard")
    ) {
        return "pendente";
    }

    return texto;
}

function obterNomeStatus(status) {
    const nomes = {
        pendente: "Pendente",
        confirmado: "Confirmado",
        preparando: "Em preparação",
        transporte: "Em transporte",
        entregue: "Entregue",
        cancelado: "Cancelado"
    };

    return nomes[normalizarStatus(status)] || status || "Não informado";
}

/* =========================================
   FORMATAR DADOS
========================================= */

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

function formatarData(data) {
    if (!data) {
        return "Data não informada";
    }

    // Trata datas no formato YYYY-MM-DD sem alterar o dia.
    const texto = String(data);
    const correspondencia = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (correspondencia) {
        return `${correspondencia[3]}/${correspondencia[2]}/${correspondencia[1]}`;
    }

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return texto;
    }

    return dataConvertida.toLocaleDateString("pt-BR");
}

function obterIdPedido(pedido) {
    return pedido.idpedidos ?? pedido.idPedido ?? pedido.id;
}

function obterNumeroPedido(pedido) {
    return pedido.numeroPedido ??
        pedido.numero_pedido ??
        `Pedido #${obterIdPedido(pedido) ?? "-"}`;
}

function obterDataPedido(pedido) {
    return pedido.datapedido ??
        pedido.dataPedido ??
        pedido.data_pedido ??
        pedido.data ??
        "";
}

function obterStatusPedido(pedido) {
    return pedido.statusPedido ??
        pedido.status_pedido ??
        pedido.status ??
        "";
}

function obterValorPedido(pedido) {
    return pedido.valorTotal ??
        pedido.valor_total ??
        pedido.total ??
        pedido.valor ??
        0;
}

/* =========================================
   MOSTRAR PEDIDOS NA TELA
========================================= */

function renderizarPedidos() {
    const termo = pesquisaPedido.value.trim().toLowerCase();
    const statusFiltro = filtroStatus.value;

    const pedidosFiltrados = pedidos.filter(pedido => {
        const numero = String(obterNumeroPedido(pedido)).toLowerCase();
        const status = normalizarStatus(obterStatusPedido(pedido));

        const correspondeNumero = numero.includes(termo);

        const correspondeStatus =
            !statusFiltro || status === statusFiltro;

        return correspondeNumero && correspondeStatus;
    });

    totalPedidos.textContent =
        `${pedidosFiltrados.length} ${
            pedidosFiltrados.length === 1 ? "pedido" : "pedidos"
        }`;

    listaPedidos.innerHTML = "";

    if (pedidosFiltrados.length === 0) {
        mensagemVazia.hidden = false;

        mensagemVazia.querySelector("h3").textContent =
            pedidos.length === 0
                ? "Nenhuma compra encontrada"
                : "Nenhum pedido corresponde à pesquisa.";

        mensagemVazia.querySelector("p").textContent =
            pedidos.length === 0
                ? "Seus pedidos aparecerão aqui quando estiverem disponíveis."
                : "Experimente alterar o número do pedido ou o filtro de status.";

        return;
    }

    mensagemVazia.hidden = true;

    pedidosFiltrados.forEach(pedido => {
        const statusOriginal = obterStatusPedido(pedido);
        const status = normalizarStatus(statusOriginal);
        const id = obterIdPedido(pedido);

        const card = document.createElement("article");
        card.className = "card-pedido";

        const informacoes = document.createElement("div");
        informacoes.className = "info-pedido";

        const numero = document.createElement("h3");
        numero.className = "numero-pedido";
        numero.textContent = obterNumeroPedido(pedido);

        const data = document.createElement("p");
        data.className = "data-pedido";
        data.textContent = `Data: ${formatarData(obterDataPedido(pedido))}`;

        const valor = document.createElement("p");
        valor.className = "valor-pedido";
        valor.textContent = formatarMoeda(obterValorPedido(pedido));

        informacoes.append(numero, data, valor);

        const acoes = document.createElement("div");
        acoes.className = "acoes-pedido";

        const etiqueta = document.createElement("span");
        etiqueta.className = `status-pedido status-${status}`;
        etiqueta.textContent = obterNomeStatus(statusOriginal);

        const botaoDetalhes = document.createElement("button");
        botaoDetalhes.type = "button";
        botaoDetalhes.className = "botao-detalhes";
        botaoDetalhes.textContent = "Ver detalhes";

        botaoDetalhes.addEventListener("click", () => {
            abrirDetalhesPedido(pedido);
        });

        acoes.append(etiqueta, botaoDetalhes);
        card.append(informacoes, acoes);

        listaPedidos.appendChild(card);
    });
}

/* =========================================
   ABRIR DETALHES DO PEDIDO
========================================= */

async function abrirDetalhesPedido(pedido) {
    pedidoSelecionado = pedido;

    const id = obterIdPedido(pedido);

    document.getElementById("detalheNomeProduto").textContent =
        "Produtos do pedido";

    document.getElementById("detalheCodigo").textContent =
        obterNumeroPedido(pedido);

    document.getElementById("detalheData").textContent =
        formatarData(obterDataPedido(pedido));

    document.getElementById("detalheStatus").textContent =
        obterNomeStatus(obterStatusPedido(pedido));

    document.getElementById("detalheValor").textContent =
        formatarMoeda(obterValorPedido(pedido));

    detalhesPedido.hidden = false;
    detalhesPedido.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    if (id == null) {
        return;
    }

    try {
        const resposta = await fetch(
            `${API}/clientes/${encodeURIComponent(cliente.id)}/pedidos/${encodeURIComponent(id)}`
        );

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        const detalhe = dados.pedido ??
            dados.dados ??
            dados;

        // Confere se o usuário não selecionou outro pedido durante a consulta.
        if (obterIdPedido(pedidoSelecionado) != id) {
            return;
        }

        document.getElementById("detalheCodigo").textContent =
            obterNumeroPedido(detalhe);

        document.getElementById("detalheData").textContent =
            formatarData(obterDataPedido(detalhe));

        document.getElementById("detalheStatus").textContent =
            obterNomeStatus(obterStatusPedido(detalhe));

        document.getElementById("detalheValor").textContent =
            formatarMoeda(obterValorPedido(detalhe));

        const produtos = detalhe.itens ??
            detalhe.produtos ??
            detalhe.itensPedido ??
            detalhe.itens_pedido;

        if (Array.isArray(produtos) && produtos.length > 0) {
            document.getElementById("detalheNomeProduto").textContent =
                produtos.map(item =>
                    `${item.nomeProduto ?? item.nome ?? item.descricao ?? "Produto"} (Qtd.: ${item.quantidade ?? 1})`
                ).join(", ");
        }

    } catch (erro) {
        console.error("Erro ao buscar detalhes do pedido:", erro);
        // Mantém na tela os dados que já vieram da lista de pedidos.
    }
}

/* =========================================
   PESQUISA E FILTROS
========================================= */

pesquisaPedido.addEventListener("input", renderizarPedidos);

filtroStatus.addEventListener("change", renderizarPedidos);

/* =========================================
   FECHAR DETALHES
========================================= */

botaoFechar.addEventListener("click", () => {
    detalhesPedido.hidden = true;
    pedidoSelecionado = null;
});

/* =========================================
   ACOMPANHAR ENTREGA
========================================= */

botaoAcompanhar.addEventListener("click", () => {
    if (!pedidoSelecionado) {
        alert("Selecione um pedido primeiro.");
        return;
    }

    const id = obterIdPedido(pedidoSelecionado);

    if (id == null) {
        alert("Não foi possível identificar este pedido.");
        return;
    }

    const status = normalizarStatus(obterStatusPedido(pedidoSelecionado));

    if (status === "cancelado") {
        alert("Este pedido foi cancelado e não possui entrega em andamento.");
        return;
    }

    window.location.href =
        `acompanhar_entrega.html?pedidoId=${encodeURIComponent(id)}`;
});

/* =========================================
   BOTÃO VOLTAR
========================================= */

botaoVoltar.addEventListener("click", () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "home_cliente.html";
    }
});

/* =========================================
   SAIR DA CONTA
========================================= */

botaoUsuario.addEventListener("click", () => {
    const confirmar = confirm("Deseja realmente sair da sua conta?");

    if (!confirmar) {
        return;
    }

    localStorage.removeItem("cliente");

    window.location.href = "login_cliente.html";
});
