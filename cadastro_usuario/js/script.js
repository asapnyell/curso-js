const form = document.getElementById("meuForm");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // impede o envio automático do form

  if (form.checkValidity()) {
    alert("Usuário cadastrado com sucesso!");
    form.reset(); // limpa o formulário (opcional)
  } else {
    form.reportValidity(); // mostra os erros nativos do navegador
  }
});
