
/* =========================================
   CADASTRO DO CLIENTE
========================================= */

const cadastroForm = document.getElementById("cadastroForm");

const nomeInput = document.getElementById("nome");
const cpfInput = document.getElementById("cpf");
const telefoneInput = document.getElementById("telefone");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");

const mostrarSenha = document.getElementById("mostrarSenha");
const mostrarConfirmarSenha = document.getElementById("mostrarConfirmarSenha");

const mensagem = document.getElementById("mensagem");
const botaoCadastrar = document.querySelector(".btn-cadastrar");

const API = "http://localhost:3000";

/* =========================================
   MOSTRAR / OCULTAR SENHA
========================================= */

mostrarSenha.addEventListener("click", () => {
    const mostrar = senhaInput.type === "password";

    senhaInput.type = mostrar ? "text" : "password";
    mostrarSenha.textContent = mostrar ? "🙈" : "👁";
});

/* =========================================
   MOSTRAR / OCULTAR CONFIRMAÇÃO
========================================= */

mostrarConfirmarSenha.addEventListener("click", () => {
    const mostrar = confirmarSenhaInput.type === "password";

    confirmarSenhaInput.type = mostrar ? "text" : "password";
    mostrarConfirmarSenha.textContent = mostrar ? "🙈" : "👁";
});

/* =========================================
   MÁSCARAS DE CPF E TELEFONE
========================================= */

cpfInput.addEventListener("input", () => {
    let valor = cpfInput.value.replace(/\D/g, "").slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    cpfInput.value = valor;
});

telefoneInput.addEventListener("input", () => {
    let valor = telefoneInput.value.replace(/\D/g, "").slice(0, 11);

    if (valor.length > 10) {
        valor = valor.replace(
            /(\d{2})(\d{5})(\d{1,4})/,
            "($1) $2-$3"
        );
    } else if (valor.length > 6) {
        valor = valor.replace(
            /(\d{2})(\d{4})(\d{1,4})/,
            "($1) $2-$3"
        );
    } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d+)/, "($1) $2");
    }

    telefoneInput.value = valor;
});

/* =========================================
   CADASTRAR CLIENTE NO MYSQL VIA BACKEND
========================================= */

cadastroForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = nomeInput.value.trim();
    const cpf = cpfInput.value.replace(/\D/g, "");
    const telefone = telefoneInput.value.replace(/\D/g, "");
    const email = emailInput.value.trim();
    const senha = senhaInput.value;
    const confirmarSenha = confirmarSenhaInput.value;

    mensagem.textContent = "";
    mensagem.className = "mensagem";

    if (!nome) {
        mensagem.textContent = "Digite seu nome completo.";
        mensagem.classList.add("erro");
        return;
    }

    if (cpf.length !== 11) {
        mensagem.textContent = "Digite um CPF válido com 11 números.";
        mensagem.classList.add("erro");
        return;
    }

    if (telefone.length !== 10 && telefone.length !== 11) {
        mensagem.textContent = "Digite um telefone válido com DDD.";
        mensagem.classList.add("erro");
        return;
    }

    if (!email || !emailInput.validity.valid) {
        mensagem.textContent = "Digite um e-mail válido.";
        mensagem.classList.add("erro");
        return;
    }

    if (senha.length < 6) {
        mensagem.textContent = "A senha deve possuir pelo menos 6 caracteres.";
        mensagem.classList.add("erro");
        return;
    }

    if (senha !== confirmarSenha) {
        mensagem.textContent = "As senhas não são iguais.";
        mensagem.classList.add("erro");
        return;
    }

    botaoCadastrar.disabled = true;
    botaoCadastrar.textContent = "Salvando...";

    try {
        const resposta = await fetch(`${API}/cadastro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                cpf,
                telefone,
                email,
                senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent =
                dados.mensagem || "Não foi possível realizar o cadastro.";

            mensagem.classList.add("erro");
            return;
        }

        mensagem.textContent =
            dados.mensagem || "Cadastro realizado com sucesso!";

        mensagem.classList.add("sucesso");

        cadastroForm.reset();

        setTimeout(() => {
            window.location.href = "login_cliente.html";
        }, 1200);

    } catch (erro) {
        console.error("Erro ao cadastrar cliente:", erro);

        mensagem.textContent =
            "Não foi possível conectar ao servidor. Verifique se ele está ativo.";

        mensagem.classList.add("erro");

    } finally {
        botaoCadastrar.disabled = false;
        botaoCadastrar.textContent = "Salvar cadastro";
    }
});
