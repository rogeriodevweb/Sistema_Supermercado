/* =========================================
   ELEMENTOS
========================================= */

const botaoUsuario = document.getElementById("botaoUsuario");
const barraLateral = document.getElementById("barraLateral");
const fecharMenu = document.getElementById("fecharMenu");

const botaoInicio = document.getElementById("botaoInicio");
const botaoEndereco = document.getElementById("botaoEndereco");
const botaoPerfil = document.getElementById("botaoPerfil");
const botaoProdutos = document.getElementById("botaoProdutos");

const voltartelaInicio = document.getElementById("voltartelaInicio");
const detalhesPedido = document.getElementById("detalhesPedido");

const formPerfilCentral = document.getElementById("formPerfilCentral");
const formEndereco = document.getElementById("formEndereco");

const telaBoasVindas = document.getElementById("telaBoasVindas");
const telaInicio = document.getElementById("telaInicio");
const telaPerfil = document.getElementById("telaPerfil");
const telaDetalhes = document.getElementById("telaDetalhes");
const telaEndereco = document.getElementById("telaEndereco");
const telaProdutos = document.getElementById("telaProdutos");

const listaProdutos = document.getElementById("listaProdutos");
const buscarProduto = document.getElementById("buscarProduto");
const mensagemProdutos = document.getElementById("mensagemProdutos");
const listaCompras = document.getElementById("listaCompras");

const API_PERFIL = "http://localhost:3000";
const API_PRODUTOS = `${API_PERFIL}/api/produtos`;

let produtosCarregados = [];
let produtosCarregando = false;

/* =========================================
   MOSTRAR TELAS
========================================= */

function mostrarTela(tela) {
    const telas = [
        telaBoasVindas,
        telaInicio,
        telaPerfil,
        telaDetalhes,
        telaEndereco,
        telaProdutos
    ];

    telas.forEach(elemento => {
        if (elemento) {
            elemento.style.display = "none";
            elemento.classList.remove("ativa");
        }
    });

    const botoes = [
        botaoInicio,
        botaoEndereco,
        botaoPerfil,
        botaoProdutos
    ];

    botoes.forEach(botao => {
        if (botao) {
            botao.classList.remove("ativo");
        }
    });

    switch (tela) {
        case "boasVindas":
            if (telaBoasVindas) {
                telaBoasVindas.style.display = "block";
                telaBoasVindas.classList.add("ativa");
            }
            break;

        case "inicio":
            if (telaInicio) {
                telaInicio.style.display = "block";
                telaInicio.classList.add("ativa");
            }

            if (botaoInicio) {
                botaoInicio.classList.add("ativo");
            }
            break;

        case "perfil":
            if (telaPerfil) {
                telaPerfil.style.display = "block";
                telaPerfil.classList.add("ativa");
            }

            if (botaoPerfil) {
                botaoPerfil.classList.add("ativo");
            }
            break;

        case "endereco":
            if (telaEndereco) {
                telaEndereco.style.display = "block";
                telaEndereco.classList.add("ativa");
            }

            if (botaoEndereco) {
                botaoEndereco.classList.add("ativo");
            }
            break;

        case "detalhes":
            if (telaDetalhes) {
                telaDetalhes.style.display = "block";
                telaDetalhes.classList.add("ativa");
            }
            break;

        case "produtos":
            if (telaProdutos) {
                telaProdutos.style.display = "block";
                telaProdutos.classList.add("ativa");
            }

            if (botaoProdutos) {
                botaoProdutos.classList.add("ativo");
            }

            carregarProdutos();
            break;
    }
}

/* =========================================
   FECHAR MENU E SAIR
========================================= */

if (fecharMenu) {
    fecharMenu.addEventListener("click", () => {
        if (barraLateral) {
            barraLateral.classList.remove("aberta");
        }
    });
}

if (botaoUsuario) {
    botaoUsuario.addEventListener("click", () => {
        const confirmar = confirm(
            "Deseja realmente sair da sua conta?"
        );

        if (!confirmar) return;

        sessionStorage.clear();

        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("cliente");

        window.location.href = "pages/login_cliente.html";
    });
}

/* =========================================
   NAVEGAÇÃO LATERAL
========================================= */

if (botaoInicio) {
    botaoInicio.addEventListener("click", () => {
        mostrarTela("inicio");
    });
}

if (botaoEndereco) {
    botaoEndereco.addEventListener("click", () => {
        mostrarTela("endereco");
        carregarEndereco();
    });
}

if (botaoPerfil) {
    botaoPerfil.addEventListener("click", () => {
        mostrarTela("perfil");
        carregarPerfil();
    });
}

if (botaoProdutos) {
    botaoProdutos.addEventListener("click", () => {
        mostrarTela("produtos");
    });
}

if (voltartelaInicio) {
    voltartelaInicio.addEventListener("click", () => {
        mostrarTela("inicio");
    });
}

/* =========================================
   FUNÇÕES AUXILIARES
========================================= */

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function formatarDataPedido(data) {
    if (!data) {
        return "Data não informada";
    }

    const dataObjeto = new Date(data);

    if (Number.isNaN(dataObjeto.getTime())) {
        return String(data);
    }

    return dataObjeto.toLocaleDateString("pt-BR");
}

function formatarValorPedido(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
/* =========================================
   TELA INICIAL - LISTA DE PRODUTOS
========================================= */

async function carregarMinhasCompras() {
    if (!listaCompras) return;

    listaCompras.innerHTML =
        "<p>Carregando produtos disponíveis...</p>";

    try {
        const resposta = await fetch(API_PRODUTOS);
        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || "Erro ao carregar produtos."
            );
        }

        const produtos = Array.isArray(dados)
            ? dados
            : Array.isArray(dados.produtos)
                ? dados.produtos
                : [];

        const disponiveis = produtos.filter(produto =>
            Number(produto.situacao) === 1 &&
            Number(produto.estoque) > 0
        );

        if (disponiveis.length === 0) {
            listaCompras.innerHTML =
                "<p>Nenhum produto disponível no momento.</p>";
            return;
        }

        listaCompras.innerHTML = disponiveis.map(produto => `
            <article class="card-produto-compra">
                <div class="produto-compra-icone">🛒</div>

                <div class="produto-compra-info">
                    <h3>${escaparHTML(produto.nome || "Produto")}</h3>

                    <p>
                        Código:
                        ${escaparHTML(produto.codigo || "-")}
                    </p>

                    <strong>
                        ${formatarValorPedido(produto.precoVenda)}
                    </strong>

                    <p>
                        Estoque: ${Number(produto.estoque)} unidades
                    </p>

                    <button
                        type="button"
                        class="botao-ver-detalhes"
                        data-produto-id="${Number(produto.idprodutos)}">
                        Visualizar informações
                    </button>
                </div>
            </article>
        `).join("");

        listaCompras
            .querySelectorAll(".botao-ver-detalhes")
            .forEach(botao => {
                botao.addEventListener("click", () => {
                    abrirDetalhesProduto(
                        Number(botao.dataset.produtoId)
                    );
                });
            });

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);

        listaCompras.innerHTML = `
            <p>
                Não foi possível carregar os produtos.
                Verifique se o servidor está ligado.
            </p>
        `;
    }
}

/* =========================================
   DETALHES DO PRODUTO
========================================= */

function abrirDetalhesProduto(produtoId) {
    const produto = produtosCarregados.find(item =>
        Number(item.idprodutos) === Number(produtoId)
    );

    if (!produto) {
        alert("Produto não encontrado. Tente novamente.");
        return;
    }

    function preencherCampo(id, valor) {
        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent =
                valor === null ||
                valor === undefined ||
                valor === ""
                    ? "-"
                    : String(valor);
        }
    }

    preencherCampo(
        "detalheNomeProduto",
        produto.nome || "Produto"
    );

    preencherCampo("detalheCodigo", produto.codigo);
    preencherCampo("detalheDescricao", produto.descricao);

    preencherCampo(
        "detalhePreco",
        formatarValorPedido(produto.precoVenda)
    );

    preencherCampo("detalheEstoque", produto.estoque);
    preencherCampo("detalheCategoria", produto.categoria);
    preencherCampo("detalheMarca", produto.marca);

    mostrarTela("detalhes");
}

/* =========================================
   DETALHES DE UM PEDIDO
   Consulta a rota do servidor:
   GET /api/pedidos/:codigo
========================================= */

async function abrirDetalhes(numeroPedido) {
    if (!numeroPedido) {
        alert("O número do pedido não foi informado.");
        return;
    }

    try {
        const resposta = await fetch(
            `${API_PERFIL}/api/pedidos/${encodeURIComponent(numeroPedido)}`
        );

        const pedido = await resposta.json();

        if (!resposta.ok) {
            alert(
                pedido.erro ||
                "Não foi possível encontrar esse pedido."
            );
            return;
        }

        if (!detalhesPedido) {
            alert(
                "O elemento de detalhes do pedido não foi encontrado no HTML."
            );
            return;
        }

        const produtosHTML = (pedido.produtos || [])
            .map(produto => `
                <div class="item-produto">
                    <strong>
                        ${escaparHTML(produto.nome || "Produto")}
                    </strong>

                    <p>
                        Quantidade:
                        ${escaparHTML(produto.quantidade ?? "-")}
                    </p>
                </div>
            `)
            .join("");

        detalhesPedido.innerHTML = `
            <h3>
                Pedido #${escaparHTML(pedido.numero || numeroPedido)}
            </h3>

            <p>
                <strong>Data:</strong>
                ${escaparHTML(formatarDataPedido(pedido.dataPedido))}
            </p>

            <p>
                <strong>Status:</strong>
                ${escaparHTML(pedido.status || "Não informado")}
            </p>

            <p>
                <strong>Destinatário:</strong>
                ${escaparHTML(pedido.destinatario || "-")}
            </p>

            <p>
                <strong>Endereço:</strong>
                ${escaparHTML(pedido.endereco || "-")}
            </p>

            <p>
                <strong>Bairro:</strong>
                ${escaparHTML(pedido.bairro || "-")}
            </p>

            <p>
                <strong>Cidade:</strong>
                ${escaparHTML(pedido.cidade || "-")}
            </p>

            <p>
                <strong>CEP:</strong>
                ${escaparHTML(pedido.cep || "-")}
            </p>

            <div class="area-acompanhar-entrega">
                <div class="card-acompanhar-entrega">
                    <div class="icone-entrega">🚚</div>

                    <div class="informacoes-entrega">
                        <h3>Acompanhar entrega</h3>
                        <p>
                            Consulte o andamento do seu pedido.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="botao-visualizar-entrega">
                        Visualizar entrega
                    </button>
                </div>
            </div>

            <h3>Produtos do pedido</h3>

            ${
                produtosHTML ||
                "<p>Nenhum produto vinculado a este pedido.</p>"
            }
        `;

        const botaoEntrega = detalhesPedido.querySelector(
    ".botao-visualizar-entrega"
);

if (botaoEntrega) {
    botaoEntrega.addEventListener("click", () => {
        const numero = pedido.numero || numeroPedido;

        window.location.href =
           `http://localhost:3000/pages/acompanhar_entrega.html?pedido=${encodeURIComponent(numero)}`;
});
}

        mostrarTela("detalhes");

    } catch (erro) {
        console.error("Erro ao consultar pedido:", erro);

        alert(
            "Erro ao conectar com o servidor para consultar o pedido."
        );
    }
}

/* =========================================
   CLIQUES EM PEDIDOS NO HTML
========================================= */

document
    .querySelectorAll(".compra, .pedido-central")
    .forEach(elemento => {
        elemento.addEventListener("click", () => {
            const numeroPedido = elemento.dataset.pedido;

            if (numeroPedido) {
                abrirDetalhes(numeroPedido);
            }
        });
    });

    /* =========================================
   MEU PERFIL - CARREGAR
========================================= */

async function carregarPerfil() {
    const clienteSalvo = localStorage.getItem("cliente");

    if (!clienteSalvo) {
        alert("Faça login novamente para acessar seu perfil.");
        return;
    }

    try {
        const cliente = JSON.parse(clienteSalvo);

        if (!cliente.id) {
            alert("Não foi possível identificar o cliente.");
            return;
        }

        const resposta = await fetch(
            `${API_PERFIL}/perfil/${cliente.id}`
        );

        const dados = await resposta.json();

        if (!resposta.ok || !dados.sucesso) {
            alert(
                dados.mensagem ||
                "Não foi possível carregar o perfil."
            );
            return;
        }

        const nome = document.getElementById("nomeClienteCentral");
        const email = document.getElementById("emailClienteCentral");
        const telefone = document.getElementById("telefoneClienteCentral");
        const senha = document.getElementById("senhaClienteCentral");

        if (nome) nome.value = dados.cliente.nome || "";
        if (email) email.value = dados.cliente.email || "";
        if (telefone) telefone.value = dados.cliente.telefone || "";
        if (senha) senha.value = "";

    } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
        alert("Erro ao conectar com o servidor.");
    }
}

/* =========================================
   MEU PERFIL - SALVAR
========================================= */

if (formPerfilCentral) {
    formPerfilCentral.addEventListener("submit", async evento => {
        evento.preventDefault();

        const clienteSalvo = localStorage.getItem("cliente");

        if (!clienteSalvo) {
            alert("Faça login novamente para salvar seu perfil.");
            return;
        }

        let cliente;

        try {
            cliente = JSON.parse(clienteSalvo);
        } catch {
            alert("Os dados do login estão inválidos. Entre novamente.");
            return;
        }

        if (!cliente.id) {
            alert("Não foi possível identificar o cliente.");
            return;
        }

        const nome = document
            .getElementById("nomeClienteCentral")?.value.trim();

        const email = document
            .getElementById("emailClienteCentral")?.value.trim();

        const telefone = document
            .getElementById("telefoneClienteCentral")?.value.trim();

        const senha = document
            .getElementById("senhaClienteCentral")?.value || "";

        if (!nome || !email || !telefone) {
            alert("Preencha nome, e-mail e telefone.");
            return;
        }

        if (senha.trim()) {
            alert(
                "A alteração de senha ainda não está configurada. " +
                "Deixe o campo senha vazio."
            );
            return;
        }

        try {
            const resposta = await fetch(
                `${API_PERFIL}/perfil/${cliente.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nome,
                        email,
                        telefone
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                alert(
                    dados.mensagem ||
                    "Não foi possível salvar o perfil."
                );
                return;
            }

            cliente.nome = nome;
            cliente.email = email;
            cliente.telefone = telefone;

            localStorage.setItem(
                "cliente",
                JSON.stringify(cliente)
            );

            const campoSenha = document.getElementById(
                "senhaClienteCentral"
            );

            if (campoSenha) campoSenha.value = "";

            alert("Perfil atualizado com sucesso!");

        } catch (erro) {
            console.error("Erro ao salvar perfil:", erro);
            alert("Erro ao conectar com o servidor.");
        }
    });
}

/* =========================================
   ENDEREÇO - CARREGAR DO BANCO
========================================= */

async function carregarEndereco() {
    const clienteSalvo = localStorage.getItem("cliente");

    if (!clienteSalvo) {
        alert("Faça login novamente para acessar seu endereço.");
        return;
    }

    let cliente;

    try {
        cliente = JSON.parse(clienteSalvo);
    } catch {
        alert("Os dados do login estão inválidos. Entre novamente.");
        return;
    }

    if (!cliente.id) {
        alert("Não foi possível identificar o cliente.");
        return;
    }

    try {
        const resposta = await fetch(
            `${API_PERFIL}/endereco/${cliente.id}`
        );

        const dados = await resposta.json();

        if (!resposta.ok || !dados.sucesso) {
            alert(
                dados.mensagem ||
                "Não foi possível carregar o endereço."
            );
            return;
        }

        const endereco = dados.endereco;

        if (!endereco) return;

        const campos = {
            cepCliente: endereco.cep,
            ruaCliente: endereco.rua,
            numeroCliente: endereco.numero,
            complementoCliente: endereco.complemento,
            bairroCliente: endereco.bairro,
            cidadeCliente: endereco.cidade,
            estadoCliente: endereco.estado
        };

        Object.entries(campos).forEach(([id, valor]) => {
            const campo = document.getElementById(id);

            if (campo) {
                campo.value = valor || "";
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar endereço:", erro);
        alert("Erro ao conectar com o servidor.");
    }
}

/* =========================================
   ENDEREÇO - SALVAR NO BANCO
========================================= */

if (formEndereco) {
    formEndereco.addEventListener("submit", async evento => {
        evento.preventDefault();

        const clienteSalvo = localStorage.getItem("cliente");

        if (!clienteSalvo) {
            alert("Faça login novamente para salvar seu endereço.");
            return;
        }

        let cliente;

        try {
            cliente = JSON.parse(clienteSalvo);
        } catch {
            alert("Os dados do login estão inválidos. Entre novamente.");
            return;
        }

        if (!cliente.id) {
            alert("Não foi possível identificar o cliente.");
            return;
        }

        const ler = id =>
            document.getElementById(id)?.value.trim() || "";

        const cep = ler("cepCliente");
        const rua = ler("ruaCliente");
        const numero = ler("numeroCliente");
        const complemento = ler("complementoCliente");
        const bairro = ler("bairroCliente");
        const cidade = ler("cidadeCliente");
        const estado = ler("estadoCliente");

        if (
            !cep ||
            !rua ||
            !numero ||
            !bairro ||
            !cidade ||
            !estado
        ) {
            alert(
                "Preencha todos os campos obrigatórios do endereço."
            );
            return;
        }

        const botaoSalvar = formEndereco.querySelector(
            'button[type="submit"]'
        );

        if (botaoSalvar) {
            botaoSalvar.disabled = true;
            botaoSalvar.textContent = "Salvando...";
        }

        try {
            const resposta = await fetch(
                `${API_PERFIL}/endereco`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        cliente_idcliente: cliente.id,
                        cep,
                        rua,
                        numero,
                        complemento,
                        bairro,
                        cidade,
                        estado
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                alert(
                    dados.mensagem ||
                    "Não foi possível salvar o endereço."
                );
                return;
            }

            alert(
                dados.mensagem ||
                "Endereço salvo com sucesso!"
            );

        } catch (erro) {
            console.error("Erro ao salvar endereço:", erro);
            alert("Erro ao conectar com o servidor.");

        } finally {
            if (botaoSalvar) {
                botaoSalvar.disabled = false;
                botaoSalvar.textContent = "Salvar endereço";
            }
        }
    });
}
/* =========================================
   PRODUTOS - CARREGAR DA API
========================================= */

async function carregarProdutos() {
    if (!listaProdutos || produtosCarregando) return;

    produtosCarregando = true;

    listaProdutos.innerHTML = `
        <tr>
            <td colspan="6" class="mensagem-vazia">
                Carregando produtos...
            </td>
        </tr>
    `;

    if (mensagemProdutos) {
        mensagemProdutos.textContent = "";
    }

    try {
        const resposta = await fetch(API_PRODUTOS);
        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem ||
                "Não foi possível carregar os produtos."
            );
        }

        if (Array.isArray(dados)) {
            produtosCarregados = dados;
        } else if (Array.isArray(dados.produtos)) {
            produtosCarregados = dados.produtos;
        } else {
            produtosCarregados = [];
        }

        filtrarProdutos();

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);

        listaProdutos.innerHTML = `
            <tr>
                <td colspan="6" class="mensagem-vazia">
                    Não foi possível carregar os produtos.
                </td>
            </tr>
        `;

        if (mensagemProdutos) {
            mensagemProdutos.textContent =
                "Verifique se o servidor está ligado e se a rota /api/produtos existe.";
        }

    } finally {
        produtosCarregando = false;
    }
}

/* =========================================
   PRODUTOS - RENDERIZAR TABELA
========================================= */

function renderizarProdutos(produtos) {
    if (!listaProdutos) return;

    if (produtos.length === 0) {
        listaProdutos.innerHTML = `
            <tr>
                <td colspan="6" class="mensagem-vazia">
                    Nenhum produto encontrado.
                </td>
            </tr>
        `;
        return;
    }

    listaProdutos.innerHTML = produtos.map(produto => {
        const codigo =
            produto.codigo ?? produto.idprodutos ?? "-";

        const nome = produto.nome ?? "Produto sem nome";

        const precoVenda = Number(produto.precoVenda ?? 0);
        const estoque = Number(produto.estoque ?? 0);

        const precoFormatado = Number.isFinite(precoVenda)
            ? formatarValorPedido(precoVenda)
            : "-";

        return `
            <tr>
                <td>${escaparHTML(codigo)}</td>

                <td>${escaparHTML(nome)}</td>

                <td>${precoFormatado}</td>

                <td>
                    ${Number.isFinite(estoque) ? estoque : "-"}
                </td>

                <td>
                    ${escaparHTML(formatarValidade(produto.validade))}
                </td>

                <td>
                    ${escaparHTML(formatarSituacao(produto.situacao))}
                </td>
            </tr>
        `;
    }).join("");
}

/* =========================================
   PRODUTOS - PESQUISAR
========================================= */

function filtrarProdutos() {
    if (!buscarProduto) {
        renderizarProdutos(produtosCarregados);
        return;
    }

    const termo = buscarProduto.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    const filtrados = produtosCarregados.filter(produto => {
        const nome = String(produto.nome ?? "")
            .toLocaleLowerCase("pt-BR");

        const codigo = String(
            produto.codigo ?? produto.idprodutos ?? ""
        ).toLocaleLowerCase("pt-BR");

        return nome.includes(termo) ||
               codigo.includes(termo);
    });

    renderizarProdutos(filtrados);
}

if (buscarProduto) {
    buscarProduto.addEventListener("input", filtrarProdutos);
}

/* =========================================
   FORMATAR VALIDADE
========================================= */

function formatarValidade(valor) {
    if (!valor) return "-";

    const texto = String(valor);

    const data = texto.match(
        /^(\d{4})-(\d{2})-(\d{2})/
    );

    if (data) {
        return `${data[3]}/${data[2]}/${data[1]}`;
    }

    return texto;
}

/* =========================================
   FORMATAR SITUAÇÃO
========================================= */

function formatarSituacao(valor) {
    if (
        valor === undefined ||
        valor === null ||
        valor === ""
    ) {
        return "-";
    }

    const situacao = String(valor).toLowerCase();

    if (["1", "ativo", "ativa"].includes(situacao)) {
        return "Ativo";
    }

    if (["0", "inativo", "inativa"].includes(situacao)) {
        return "Inativo";
    }

    return String(valor);
}



/* =========================================
   INICIALIZAÇÃO
========================================= */

mostrarTela("boasVindas");

carregarProdutos();

carregarMinhasCompras();