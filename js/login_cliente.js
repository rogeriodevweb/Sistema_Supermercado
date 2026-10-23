
/* =========================================
   LOGIN DO CLIENTE
========================================= */

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const mostrarSenha = document.getElementById("mostrarSenha");
const mensagem = document.getElementById("mensagem");
const botaoLogin = document.querySelector(".btn-login");

// Endereço do servidor
const API_URL = "http://localhost:3000";


/* =========================================
   MOSTRAR / OCULTAR SENHA
========================================= */

if (mostrarSenha && senhaInput) {
    mostrarSenha.addEventListener("click", () => {
        if (senhaInput.type === "password") {
            senhaInput.type = "text";
            mostrarSenha.textContent = "🙈";
        } else {
            senhaInput.type = "password";
            mostrarSenha.textContent = "👁";
        }
    });
}


/* =========================================
   LOGIN DO CLIENTE
========================================= */

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        mensagem.textContent = "";
        mensagem.className = "mensagem";

        /* Validação */
        if (!email || !senha) {
            mensagem.textContent = "Preencha o e-mail e a senha.";
            mensagem.classList.add("erro");
            return;
        }

        /* Desabilitar botão */
        if (botaoLogin) {
            botaoLogin.disabled = true;
            botaoLogin.textContent = "Entrando...";
        }

        try {
            const resposta = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            });

            const dados = await resposta.json();

            /* Tratar falha no login */
            if (!resposta.ok || !dados.sucesso) {
                mensagem.textContent =
                    dados.mensagem || "E-mail ou senha incorretos.";

                mensagem.classList.add("erro");
                return;
            }

            /* Login realizado */
            mensagem.textContent = "Login realizado com sucesso!";
            mensagem.classList.add("sucesso");

            /* Salvar dados do cliente */
            localStorage.setItem(
                "cliente",
                JSON.stringify(dados.cliente)
            );

            /* Redirecionar para a página inicial */
            setTimeout(() => {
                window.location.href = "/index.html";
            }, 1000);

        } catch (erro) {
            console.error("Erro ao realizar login:", erro);

            mensagem.textContent =
                "Não foi possível conectar ao servidor. Verifique se ele está ligado.";

            mensagem.classList.add("erro");

        } finally {
            if (botaoLogin) {
                botaoLogin.disabled = false;
                botaoLogin.textContent = "Entrar";
            }
        }
    });
} else {
    console.error('Formulário com ID "loginForm" não encontrado.');
}
