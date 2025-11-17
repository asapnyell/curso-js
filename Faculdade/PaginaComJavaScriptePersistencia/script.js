// script.js — cadastro + armazenamento local

// Aguarda o DOM estar completamente carregado antes de executar o script
document.addEventListener("DOMContentLoaded", () => {

  // Seleciona os elementos do HTML com os quais vamos interagir
  const form = document.getElementById("formCadastro");
  const nome = document.getElementById("nome");
  const email = document.getElementById("email");
  const idade = document.getElementById("idade");
  const resultado = document.getElementById("resultado");

  // REQUISITO 3: "Faça uso do LocalStorage para simular o backend."
  // Carrega a lista de usuários do LocalStorage. 
  // Se não houver nada (||), começa com um array vazio.
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // --- REQUISITO 2: "usar as funções que vimos no estudo de caso" ---

  // Função de validação para o nome
  function validarNome(valor) {
    return valor.trim().length > 2; // Nome deve ter mais de 2 caracteres
  }

  // Função de validação para o email
  function validarEmail(valor) {
    // Verificação simples de email
    return valor.includes("@") && valor.includes(".");
  }

  // Função de validação para a idade
  function validarIdade(valor) {
    const numero = Number(valor);
    return Number.isInteger(numero) && numero >= 18 && numero <= 120; // Deve ser maior de 18
  }

  // Função auxiliar para mostrar feedback (sucesso/erro) na tela
  function mostrarResultado(html, tipo = "info") {
    resultado.innerHTML = `<div class="alert alert-${tipo} mt-3">${html}</div>`;
  }

  // Função auxiliar para marcar campos como válidos ou inválidos (estilo Bootstrap)
  function marcarCampo(inputEl, valido) {
    inputEl.classList.remove("is-valid", "is-invalid");
    if (valido) {
      inputEl.classList.add("is-valid");
    } else {
      inputEl.classList.add("is-invalid");
    }
  }

  // Função principal: Adiciona o usuário no array E salva o array atualizado no LocalStorage
  function adicionarUsuario(n, e, i) {
    // 1. Adiciona o novo usuário (como objeto) ao array 'usuarios'
    usuarios.push({ nome: n, email: e, idade: i });
    
    // 2. Salva o array ATUALIZADO de volta no LocalStorage
    // É preciso usar JSON.stringify para converter o array de objetos em texto
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  // --- Fim das Funções ---

  // Validação em tempo real (Feedback enquanto o usuário digita)
  if (nome && email && idade) {
    nome.addEventListener("input", () => marcarCampo(nome, validarNome(nome.value)));
    email.addEventListener("input", () => marcarCampo(email, validarEmail(email.value)));
    idade.addEventListener("input", () => marcarCampo(idade, validarIdade(idade.value)));
  }

  // Processamento do Cadastro (quando o formulário é enviado)
  if (form) {
    form.addEventListener("submit", (event) => {
      // Previne o comportamento padrão do formulário (que é recarregar a página)
      event.preventDefault();

      // Roda todas as validações
      const nomeValido = validarNome(nome.value);
      const emailValido = validarEmail(email.value);
      const idadeValida = validarIdade(idade.value);

      // Marca os campos visualmente
      marcarCampo(nome, nomeValido);
      marcarCampo(email, emailValido);
      marcarCampo(idade, idadeValida);

      // Verifica se TODOS os campos são válidos
      if (nomeValido && emailValido && idadeValida) {
        // Se sim, adiciona o usuário e salva no LocalStorage
        adicionarUsuario(nome.value, email.value, Number(idade.value));
        
        // Mostra mensagem de sucesso
        mostrarResultado("Usuário cadastrado com sucesso!", "success");
        
        // Limpa o formulário e as marcas de validação
        form.reset();
        [nome, email, idade].forEach(i => i.classList.remove("is-valid", "is-invalid"));
      
      } else {
        // Se não, mostra mensagem de erro
        mostrarResultado("Há erros no formulário. Verifique os campos.", "danger");
      }
    });
  }

});