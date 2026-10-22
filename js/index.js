
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

/* =========================================
   TELAS CENTRAIS
========================================= */

const telaInicio = document.getElementById("telaInicio");
const telaPerfil = document.getElementById("telaPerfil");
const telaDetalhes = document.getElementById("telaDetalhes");
const telaEndereco = document.getElementById("telaEndereco");
const telaProdutos = document.getElementById("telaProdutos");

/* =========================================
   ELEMENTOS DA TELA DE PRODUTOS
========================================= */

const listaProdutos = document.getElementById("listaProdutos");
const buscarProduto = document.getElementById("buscarProduto");
const mensagemProdutos = document.getElementById("mensagemProdutos");

const API_PERFIL = "http://localhost:3000";
const API_PRODUTOS = "http://localhost:3000/api/produtos";

let produtosCarregados = [];
let produtosCarregando = false;

/* =========================================
   MOSTRAR TELA CENTRAL
========================================= */

function mostrarTela(tela) {
    const telas = [
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
   BOTÃO FECHAR MENU
========================================= */

if (fecharMenu) {
    fecharMenu.addEventListener("click", () => {
        if (barraLateral) {
            barraLateral.classList.remove("aberta");
        }
    });
}

/* =========================================
   BOTÃO USUÁRIO - SAIR
========================================= */

if (botaoUsuario) {
    botaoUsuario.addEventListener("click", () => {
        const confirmar = confirm(
            "Deseja realmente sair da sua conta?"
        );

        if (!confirmar) {
            return;
        }

        sessionStorage.clear();

        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("cliente");

        window.location.href = "pages/login_cliente.html";
    });
}

/* =========================================
   BOTÃO INÍCIO / MINHAS COMPRAS
========================================= */

if (botaoInicio) {
    botaoInicio.addEventListener("click", () => {
        mostrarTela("inicio");
    });
}

/* =========================================
   BOTÃO MEU ENDEREÇO
========================================= */

if (botaoEndereco) {
    botaoEndereco.addEventListener("click", () => {
        mostrarTela("endereco");
    });
}

/* =========================================
   BOTÃO MEU PERFIL
========================================= */

if (botaoPerfil) {
    botaoPerfil.addEventListener("click", () => {
        mostrarTela("perfil");
        carregarPerfil();
    });
}

/* =========================================
   BOTÃO PRODUTOS
========================================= */

if (botaoProdutos) {
    botaoProdutos.addEventListener("click", () => {
        mostrarTela("produtos");
    });
}

/* =========================================
   DADOS DOS PEDIDOS
========================================= */

const pedidos = {
    "001": {
        numero: "001",
        data: "15/09/2026",
        total: "125,90",
        status: "Concluída",
        pagamento: "Cartão de crédito",
        endereco: "Endereço cadastrado",
        produtos: [
            {
                nome: "Arroz 5kg",
                quantidade: 1,
                preco: "25,90"
            },
            {
                nome: "Feijão 1kg",
                quantidade: 2,
                preco: "8,00"
            },
            {
                nome: "Produtos diversos",
                quantidade: 1,
                preco: "84,00"
            }
        ]
    },

    "002": {
        numero: "002",
        data: "10/09/2026",
        total: "87,50",
        status: "Concluída",
        pagamento: "Pix",
        endereco: "Endereço cadastrado",
        produtos: [
            {
                nome: "Produtos diversos",
                quantidade: 1,
                preco: "87,50"
            }
        ]
    }
};

/* =========================================
   ABRIR DETALHES DO PEDIDO
========================================= */

function abrirDetalhes(numeroPedido) {
    const pedido = pedidos[numeroPedido];

    if (!pedido) {
        if (detalhesPedido) {
            detalhesPedido.innerHTML = `
                <p>Pedido não encontrado.</p>
            `;
        }

        mostrarTela("detalhes");
        return;
    }

    let produtosHTML = "";

    pedido.produtos.forEach(produto => {
        produtosHTML += `
            <div class="item-produto">
                <strong>${escaparHTML(produto.nome)}</strong>

                <p>Quantidade: ${produto.quantidade}</p>

                <p>Preço: R$ ${escaparHTML(produto.preco)}</p>
            </div>
        `;
    });

    if (detalhesPedido) {
        detalhesPedido.innerHTML = `
            <h3>Compra #${pedido.numero}</h3>

            <p>
                <strong>Data:</strong>
                ${escaparHTML(pedido.data)}
            </p>

            <p>
                <strong>Status:</strong>
                ${escaparHTML(pedido.status)}
            </p>

            <p>
                <strong>Pagamento:</strong>
                ${escaparHTML(pedido.pagamento)}
            </p>

            <p>
                <strong>Endereço:</strong>
                ${escaparHTML(pedido.endereco)}
            </p>

            <div class="area-acompanhar-entrega">
                <div class="card-acompanhar-entrega">
                    <div class="icone-entrega">🚚</div>

                    <div class="informacoes-entrega">
                        <h3>Acompanhar entrega</h3>
                        <p>Seu pedido está a caminho.</p>
                    </div>

                    <button
                        type="button"
                        class="botao-visualizar-entrega"
                        onclick="window.location.href='pages/acompanhar_entrega.html'"
                    >
                        Visualizar entrega
                    </button>
                </div>
            </div>

            <h3>Produtos comprados</h3>

            ${produtosHTML}

            <div class="total-pedido">
                Total: R$ ${escaparHTML(pedido.total)}
            </div>
        `;
    }

    mostrarTela("detalhes");
}

/* =========================================
   CLIQUE NAS COMPRAS
========================================= */

const compras = document.querySelectorAll(".compra");

compras.forEach(compra => {
    compra.addEventListener("click", () => {
        const numeroPedido = compra.dataset.pedido;
        abrirDetalhes(numeroPedido);
    });
});

/* =========================================
   CLIQUE NOS PEDIDOS DO CENTRO
========================================= */

const pedidosCentrais = document.querySelectorAll(".pedido-central");

pedidosCentrais.forEach(pedido => {
    pedido.addEventListener("click", () => {
        const numeroPedido = pedido.dataset.pedido;
        abrirDetalhes(numeroPedido);
    });
});

/* =========================================
   VOLTAR PARA MINHAS COMPRAS
========================================= */

if (voltartelaInicio) {
    voltartelaInicio.addEventListener("click", () => {
        mostrarTela("inicio");
    });
}

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
            alert(
                "Não foi possível identificar o cliente. Faça login novamente."
            );
            return;
        }

        const resposta = await fetch(
            `${API_PERFIL}/perfil/${cliente.id}`
        );

        const dados = await resposta.json();

        if (!resposta.ok || !dados.sucesso) {
            alert(
                dados.mensagem || "Não foi possível carregar o perfil."
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
            .getElementById("nomeClienteCentral")
            ?.value.trim();

        const email = document
            .getElementById("emailClienteCentral")
            ?.value.trim();

        const telefone = document
            .getElementById("telefoneClienteCentral")
            ?.value.trim();

        const senha = document
            .getElementById("senhaClienteCentral")
            ?.value || "";

        if (!nome || !email || !telefone) {
            alert("Preencha nome, e-mail e telefone.");
            return;
        }

        if (senha.trim()) {
            alert(
                "A alteração de senha será configurada separadamente. " +
                "Deixe o campo senha vazio por enquanto."
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
                    dados.mensagem || "Não foi possível salvar o perfil."
                );
                return;
            }

            cliente.nome = nome;
            cliente.email = email;

            localStorage.setItem("cliente", JSON.stringify(cliente));

            const campoSenha =
                document.getElementById("senhaClienteCentral");

            if (campoSenha) {
                campoSenha.value = "";
            }

            alert("Perfil atualizado com sucesso!");

        } catch (erro) {
            console.error("Erro ao salvar perfil:", erro);
            alert("Erro ao conectar com o servidor.");
        }
    });
}

/* =========================================
   SALVAR ENDEREÇO
========================================= */

if (formEndereco) {
    formEndereco.addEventListener("submit", evento => {
        evento.preventDefault();

        const cep = document.getElementById("cepCliente")?.value.trim();
        const rua = document.getElementById("ruaCliente")?.value.trim();
        const numero = document.getElementById("numeroCliente")?.value.trim();
        const complemento = document
            .getElementById("complementoCliente")?.value.trim();
        const bairro = document.getElementById("bairroCliente")?.value.trim();
        const cidade = document.getElementById("cidadeCliente")?.value.trim();
        const estado = document.getElementById("estadoCliente")?.value.trim();

        if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
            alert("Preencha todos os campos obrigatórios do endereço.");
            return;
        }

        const endereco = {
            cep,
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            estado
        };

        console.log("Endereço atualizado:", endereco);

        alert("Endereço atualizado com sucesso!");
    });
}

/* =========================================
   PRODUTOS - CARREGAR DA API
========================================= */

async function carregarProdutos() {
    if (!listaProdutos || produtosCarregando) {
        return;
    }

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
                dados.mensagem || "Não foi possível carregar os produtos."
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
    if (!listaProdutos) {
        return;
    }

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
        const codigo = produto.codigo ?? produto.idprodutos ?? "-";
        const nome = produto.nome ?? "Produto sem nome";
        const precoVenda = Number(produto.precoVenda ?? 0);
        const estoque = Number(produto.estoque ?? 0);

        const precoFormatado = Number.isFinite(precoVenda)
            ? precoVenda.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })
            : "-";

        const validade = formatarValidade(produto.validade);
        const situacao = formatarSituacao(produto.situacao);

        return `
            <tr>
                <td>${escaparHTML(codigo)}</td>
                <td>${escaparHTML(nome)}</td>
                <td>${precoFormatado}</td>
                <td>${Number.isFinite(estoque) ? estoque : "-"}</td>
                <td>${escaparHTML(validade)}</td>
                <td>${escaparHTML(situacao)}</td>
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

        return nome.includes(termo) || codigo.includes(termo);
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
    if (!valor) {
        return "-";
    }

    const texto = String(valor);
    const data = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (data) {
        return `${data[3]}/${data[2]}/${data[1]}`;
    }

    return texto;
}

/* =========================================
   FORMATAR SITUAÇÃO
========================================= */

function formatarSituacao(valor) {
    if (valor === undefined || valor === null || valor === "") {
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
   ESCAPAR HTML
========================================= */

function escaparHTML(valor) {
    return String(valor).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

/* =========================================
   TELA INICIAL
========================================= */

mostrarTela("inicio");
