/* =========================================================
   ACOMPANHAR ENTREGA
========================================================= */

const API = "http://localhost:3000";

const ETAPAS_PADRAO = [
    { titulo: "Pedido realizado", icone: "📦" },
    { titulo: "Pagamento confirmado", icone: "💳" },
    { titulo: "Pedido preparado", icone: "📋" },
    { titulo: "Em transporte", icone: "🚚" },
    { titulo: "Pedido entregue", icone: "📍" }
];

let consultandoPedido = false;

/* =========================================================
   LIMPAR CAMPOS
========================================================= */

function limparPedido() {
    const campos = [
        "numeroPedido",
        "statusPedido",
        "previsaoEntrega",
        "ultimaAtualizacao",
        "transportadora",
        "codigoRastreio",
        "tipoEnvio",
        "nomeDestinatario",
        "enderecoRua",
        "enderecoBairro",
        "enderecoCidade",
        "enderecoCep"
    ];

    campos.forEach(id => preencher(id, ""));

    const status = document.getElementById("statusPedido");

    if (status) {
        status.className = "status";
    }

    const nomeProduto = document.getElementById("nomeProduto");
    const quantidadeProduto = document.getElementById("quantidadeProduto");

    if (nomeProduto) nomeProduto.replaceChildren();
    if (quantidadeProduto) quantidadeProduto.replaceChildren();

    limparLinhaDoTempo();
}

/* =========================================================
   CRIAR LINHA DO TEMPO
========================================================= */

function limparLinhaDoTempo() {
    const linha = document.getElementById("linhaDoTempo");

    if (!linha) return;

    linha.replaceChildren();

    ETAPAS_PADRAO.forEach(etapa => {
        const item = document.createElement("div");
        item.className = "timeline-item";

        const icone = document.createElement("div");
        icone.className = "timeline-icon";
        icone.textContent = etapa.icone;

        const informacoes = document.createElement("div");
        informacoes.className = "timeline-info";

        const titulo = document.createElement("h3");
        titulo.textContent = etapa.titulo;

        const descricao = document.createElement("p");
        const data = document.createElement("span");

        informacoes.append(titulo, descricao, data);
        item.append(icone, informacoes);
        linha.appendChild(item);
    });
}

/* =========================================================
   MENSAGEM DA BUSCA
========================================================= */

function mostrarMensagem(texto, erro = false) {
    const mensagem = document.getElementById("mensagemBusca");

    if (!mensagem) return;

    mensagem.textContent = texto;
    mensagem.classList.toggle("erro", erro);
}

/* =========================================================
   CARREGAR PEDIDO DA PÁGINA ANTERIOR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    limparPedido();

    const parametros = new URLSearchParams(window.location.search);
    const numeroPedido = parametros.get("pedido");

    const campo = document.getElementById("codigoPedido");

    if (campo && numeroPedido) {
        campo.value = numeroPedido;
        consultarPedido();
    }

    if (campo) {
        campo.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                consultarPedido();
            }
        });
    }
});

/* =========================================================
   CONSULTAR PEDIDO
========================================================= */

async function consultarPedido() {
    if (consultandoPedido) return;

    const input = document.getElementById("codigoPedido");
    const codigo = input ? input.value.trim() : "";

    if (!codigo) {
        mostrarMensagem("Digite o código do pedido.", true);
        return;
    }

    consultandoPedido = true;
    limparPedido();
    mostrarMensagem("Consultando pedido...");

    try {
        const pedido = await buscarPedidoPorCodigo(codigo);

        if (!pedido || typeof pedido !== "object") {
            throw new Error("A API não retornou os detalhes do pedido.");
        }

        carregarPedido(pedido);
        mostrarMensagem("Pedido encontrado!");
    } catch (erro) {
        console.error("Erro ao consultar pedido:", erro);

        mostrarMensagem(
            erro.message || "Não foi possível consultar o pedido.",
            true
        );
    } finally {
        consultandoPedido = false;
    }
}

/* =========================================================
   BUSCAR PEDIDO NA API
========================================================= */

async function buscarPedidoPorCodigo(codigo) {
    const resposta = await fetch(
        `${API}/api/pedidos/${encodeURIComponent(codigo)}`
    );

    const tipoConteudo = resposta.headers.get("content-type") || "";

    if (!tipoConteudo.includes("application/json")) {
        throw new Error(
            "A API não retornou JSON. Verifique a rota de pedidos no servidor."
        );
    }

    const dados = await resposta.json();

    if (!resposta.ok || dados.sucesso === false) {
        throw new Error(
            dados.mensagem ||
            (resposta.status === 404
                ? "Pedido não encontrado."
                : `Erro ao consultar pedido (${resposta.status}).`)
        );
    }

    return dados.pedido || dados;
}

/* =========================================================
   PREENCHER DETALHES DO PEDIDO
========================================================= */

function carregarPedido(pedido) {
    const numero = pedido.numeroPedido ?? pedido.numero ?? pedido.codigo ?? "";
    const status = pedido.statusEntrega ?? pedido.statusPedido ?? pedido.status ?? "";
    const previsao = pedido.dataEntrega ?? pedido.previsao ?? pedido.previsaoEntrega ?? "";

    preencher("numeroPedido", numero);
    preencher("statusPedido", status);
    preencher("previsaoEntrega", formatarData(previsao));
    preencher(
        "ultimaAtualizacao",
        formatarData(pedido.atualizacao ?? pedido.datapedido ?? "")
    );

    preencher("transportadora", pedido.transportadora || "Não informada");
    preencher(
        "codigoRastreio",
        pedido.rastreio ?? pedido.codigoRastreio ?? "Não disponível"
    );
    preencher("tipoEnvio", pedido.tipoEnvio || "Não informado");

    preencher(
        "nomeDestinatario",
        pedido.destinatario ?? pedido.nomeDestinatario ?? ""
    );

    const rua = pedido.endereco ?? pedido.rua ?? "";
    const numeroEndereco = pedido.numeroEndereco ?? "";
    const complemento = pedido.complemento ?? "";

    const enderecoCompleto = [
        rua,
        numeroEndereco,
        complemento
    ].filter(Boolean).join(", ");

    preencher("enderecoRua", enderecoCompleto);
    preencher("enderecoBairro", pedido.bairro ?? "");
    preencher("enderecoCidade", pedido.cidade ?? "");

    const cep = pedido.cep ?? "";

    preencher(
        "enderecoCep",
        cep ? `CEP: ${cep}` : ""
    );

    atualizarStatus(status);
    carregarProdutos(pedido.produtos ?? pedido.itens ?? []);
    atualizarLinhaDoTempo(pedido.etapas ?? [], status);
}





/* =========================================================
   PREENCHER CAMPO COM SEGURANÇA
========================================================= */

function preencher(id, valor) {
    const elemento = document.getElementById(id);

    if (!elemento) return;

    elemento.textContent = valor == null ? "" : String(valor);
}

/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarData(valor) {
    if (!valor) return "";

    const texto = String(valor);

    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
        const [ano, mes, dia] = texto.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    return texto;
}

/* =========================================================
   ATUALIZAR ESTILO DO STATUS
========================================================= */

function atualizarStatus(status) {
    const elemento = document.getElementById("statusPedido");

    if (!elemento) return;

    elemento.className = "status";

    const situacao = normalizarTexto(status);

    if (situacao.includes("cancel")) {
        elemento.classList.add("cancelado");
    } else if (
        situacao.includes("entregue") ||
        situacao.includes("finalizado")
    ) {
        elemento.classList.add("finalizado");
    } else if (situacao) {
        elemento.classList.add("entregue");
    }
}

/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizarTexto(texto) {
    return String(texto ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

/* =========================================================
   ATUALIZAR LINHA DO TEMPO
========================================================= */

function atualizarLinhaDoTempo(etapas, status) {
    const linha = document.getElementById("linhaDoTempo");

    if (!linha) return;

    const itens = linha.querySelectorAll(".timeline-item");
    const situacao = normalizarTexto(status);

    let etapaAtual = 0;

    if (situacao.includes("cancel")) {
        etapaAtual = -1;
    } else if (
        situacao.includes("entregue") ||
        situacao.includes("finalizado")
    ) {
        etapaAtual = 4;
    } else if (
        situacao.includes("transporte") ||
        situacao.includes("caminho")
    ) {
        etapaAtual = 3;
    } else if (
        situacao.includes("preparado") ||
        situacao.includes("separado")
    ) {
        etapaAtual = 2;
    } else if (
        situacao.includes("pagamento") ||
        situacao.includes("confirmado")
    ) {
        etapaAtual = 1;
    }

    itens.forEach((item, indice) => {
        const etapa = Array.isArray(etapas) ? etapas[indice] : null;

        const descricao = item.querySelector(".timeline-info p");
        const data = item.querySelector(".timeline-info span");

        item.classList.remove("concluido", "ativo");

        if (etapa) {
            if (descricao) {
                descricao.textContent = etapa.descricao ?? "";
            }

            if (data) {
                data.textContent = formatarData(etapa.data ?? "");
            }

            item.classList.toggle("concluido", etapa.concluida === true);
            item.classList.toggle("ativo", etapa.ativa === true);
            return;
        }

        if (descricao) descricao.textContent = "";
        if (data) data.textContent = "";

        if (etapaAtual === -1) return;

        if (indice < etapaAtual) {
            item.classList.add("concluido");
        } else if (indice === etapaAtual) {
            item.classList.add("ativo");
        }
    });
}

/* =========================================================
   VOLTAR
========================================================= */

function voltarPagina() {
    if (
        document.referrer &&
        new URL(document.referrer).origin === window.location.origin
    ) {
        history.back();
    } else {
        window.location.href = "../index.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarMinhasCompras();
});

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

limparPedido();
