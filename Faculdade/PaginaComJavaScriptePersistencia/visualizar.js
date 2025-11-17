// Aguarda o DOM estar completamente carregado
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Seleciona a div onde a lista será mostrada
    const listaDiv = document.getElementById("listaUsuarios");
    
    // 2. Pega os dados salvos no LocalStorage (que foram salvos pelo 'script.js')
    // Usa JSON.parse para converter o texto de volta em um array de objetos
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // 3. Verifica se há usuários cadastrados
    if (usuarios.length === 0) {
      // Se não houver, mostra um aviso
      listaDiv.innerHTML = '<div class="alert alert-warning">Nenhum usuário cadastrado.</div>';
    } else {
      // Se houver, transforma (mapeia) cada objeto de usuário em um bloco de HTML
      const listaHTML = usuarios.map((usuario, index) => {
        // Usei template literals (crases ``) para criar o HTML facilmente
        return `
          <div class="border-bottom py-3">
            <h5 class="mb-1">${index + 1}. ${usuario.nome}</h5>
            <p class="mb-0 text-muted"><strong>Idade:</strong> ${usuario.idade} anos</p>
            <p class="mb-0 text-muted"><strong>Email:</strong> ${usuario.email}</p>
          </div>
        `;
      }).join(""); // .join("") junta todos os blocos de HTML em um único texto
      
      // 4. Insere o HTML gerado dentro da 'listaDiv'
      listaDiv.innerHTML = listaHTML;
    }
});