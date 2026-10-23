/* =========================================================
   ACOMPANHAR ENTREGA
========================================================= */

const API = "http://localhost:3000";

/* =========================================================
   LIMPAR CAMPOS DO PEDIDO
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
        "enderecoCep",
        "nomeProduto",
        "quantidadeProduto"
    ];

    campos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = "";
        }
    });

    const status = document.getElementById("statusPedido");

    if (status) {
        status.className = "status";
    }

    limparLinhaDoTempo();
}

/* =========================================================
   LIMPAR LINHA DO TEMPO
========================================================= */

function limparLinhaDoTempo() {
    const linha = document.getElementById("linhaDoTempo");

    if (!linha) return;

    const etapas = [
        {
            titulo: "Pedido realizado",
            icone: "📦"
        },
        {
            titulo: "Pagamento confirmado",
            icone: "💳"
        },
        {
            titulo: "Pedido preparado",
            icone: "📋"
        },
        {
            titulo: "Em transporte",
            icone: "🚚"
        },
        {
            titulo: "Pedido entregue",
            icone: "📍"
        }
    ];

    linha.replaceChildren();

    etapas.forEach(etapa => {
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

/* =========================================
   CARREGAR PEDIDO ENVIADO PELA TELA ANTERIOR
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const parametros = new URLSearchParams(window.location.search);
    const numeroPedido = parametros.get("pedido");

    if (!numeroPedido) return;

    const campo = document.getElementById("codigoPedido");

    if (campo) {
        campo.value = numeroPedido;
    }

    consultarPedido();
});

/* =========================================================
   CONSULTAR PEDIDO
========================================================= */

async function consultarPedido() {
    const input = document.getElementById("codigoPedido");
    const mensagem = document.getElementById("mensagemBusca");
    const codigo = input.value.trim();

    mensagem.textContent = "";

    if (!codigo) {
        mensagem.textContent = "Digite o código do pedido.";
        return;
    }

    limparPedido();
    mensagem.textContent = "Consultando pedido...";

    /*
       A consulta real será ligada à rota de pedidos do seu
       backend quando confirmarmos a rota e as tabelas.
    */

    try {
        const resposta = await buscarPedidoPorCodigo(codigo);

        if (!resposta) {
            mensagem.textContent =
                "Não foi possível consultar o pedido. " +
                "Verifique a rota da API de pedidos.";
            return;
        }

        carregarPedido(resposta);
        mensagem.textContent = "Pedido encontrado!";

    } catch (erro) {
        console.error("Erro ao consultar pedido:", erro);

        mensagem.textContent =
            "Erro ao consultar o pedido. Verifique se o servidor está ligado.";
    }
}

/* =========================================================
   BUSCAR PEDIDO NA API
========================================================= */

async function buscarPedidoPorCodigo(codigo) {
    /*
       IMPORTANTE:
       Substitua a URL abaixo pela rota REAL do seu backend.
       Esta rota é apenas o formato esperado, não uma rota
       confirmada como existente no seu servidor.
    */

    const resposta = await fetch(
        `${API}/api/pedidos/${encodeURIComponent(codigo)}`
    );

    if (resposta.status === 404) {
        return null;
    }

    if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();

    return dados.pedido || dados;
}

/* =========================================================
   PREENCHER CAMPOS DO PEDIDO
========================================================= */


function carregarPedido(pedido) {
    preencher("numeroPedido", pedido.numero ?? pedido.codigo ?? "");
    preencher("statusPedido", pedido.status ?? "");
    preencher("previsaoEntrega", pedido.previsao ?? pedido.previsaoEntrega ?? "");
    preencher("ultimaAtualizacao", pedido.atualizacao ?? "");

    preencher("transportadora", pedido.transportadora ?? "Não informada");
    preencher("codigoRastreio", pedido.rastreio ?? pedido.codigoRastreio ?? "Não disponível");
    preencher("tipoEnvio", pedido.tipoEnvio ?? "Não informado");

    preencher("nomeDestinatario", pedido.destinatario ?? pedido.nomeDestinatario ?? "");
    preencher("enderecoRua", pedido.endereco ?? pedido.rua ?? "");
    preencher("enderecoBairro", pedido.bairro ?? "");
    preencher("enderecoCidade", pedido.cidade ?? "");
    preencher("enderecoCep", pedido.cep ? `CEP: ${pedido.cep}` : "");

    // A API retorna os produtos em pedido.produtos
    const produtos = Array.isArray(pedido.produtos)
        ? pedido.produtos
        : Array.isArray(pedido.itens)
            ? pedido.itens
            : [];

    const nomeProduto = document.getElementById("nomeProduto");
    const quantidadeProduto = document.getElementById("quantidadeProduto");

    if (nomeProduto) {
        nomeProduto.replaceChildren();
    }

    if (quantidadeProduto) {
        quantidadeProduto.textContent = "";
    }

    if (produtos.length > 0) {
        produtos.forEach(produto => {
            const nome = produto.nome ?? produto.nomeProduto ?? "Produto sem nome";
            const quantidade = produto.quantidade ?? 0;

            if (nomeProduto) {
                const item = document.createElement("div");
                item.className = "produto-entrega";
                item.textContent = nome;
                nomeProduto.appendChild(item);
            }

            if (quantidadeProduto) {
                const quantidadeItem = document.createElement("div");
                quantidadeItem.textContent = `Quantidade: ${quantidade}`;
                quantidadeProduto.appendChild(quantidadeItem);
            }
        });
    } else {
        preencher("nomeProduto", "Nenhum produto encontrado neste pedido.");
    }

    atualizarStatus(pedido.status ?? "");
    atualizarLinhaDoTempo(pedido.etapas ?? []);
}


/* =========================================================
   PREENCHER UM CAMPO COM SEGURANÇA
========================================================= */

function preencher(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor == null ? "" : String(valor);
    }
}

/* =========================================================
   ATUALIZAR ESTILO DO STATUS
========================================================= */

function atualizarStatus(status) {
    const elemento = document.getElementById("statusPedido");

    if (!elemento) return;

    elemento.className = "status";

    const situacao = String(status).toLowerCase();

    if (situacao === "entregue") {
        elemento.classList.add("finalizado");
    } else if (situacao === "cancelado") {
        elemento.classList.add("cancelado");
    } else if (situacao) {
        elemento.classList.add("entregue");
    }
}

/* =========================================================
   PREENCHER LINHA DO TEMPO
========================================================= */

function atualizarLinhaDoTempo(etapas) {
    const linha = document.getElementById("linhaDoTempo");

    if (!linha || !Array.isArray(etapas)) return;

    const itens = linha.querySelectorAll(".timeline-item");

    itens.forEach((item, indice) => {
        const etapa = etapas[indice];

        const descricao = item.querySelector(".timeline-info p");
        const data = item.querySelector(".timeline-info span");

        if (!etapa) {
            item.classList.remove("concluido", "ativo");

            if (descricao) descricao.textContent = "";
            if (data) data.textContent = "";

            return;
        }

        if (descricao) {
            descricao.textContent = etapa.descricao ?? "";
        }

        if (data) {
            data.textContent = etapa.data ?? "";
        }

        item.classList.toggle("concluido", etapa.concluida === true);
        item.classList.toggle("ativo", etapa.ativa === true);
    });
}

/* =========================================================
   ENTER NO CAMPO DE BUSCA
========================================================= */

const campoCodigoPedido = document.getElementById("codigoPedido");

if (campoCodigoPedido) {
    campoCodigoPedido.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            consultarPedido();
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

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

limparPedido();
