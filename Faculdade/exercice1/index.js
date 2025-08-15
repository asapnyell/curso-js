document.addEventListener('DOMContentLoaded', function() {
  const msg = document.getElementById('mensagem');
  const btnClick = document.querySelector('.botao');
   const btnClick2 = document.querySelector('.botao2');

  function alterarMensagem() {
    msg.textContent = 'Você clicou no botão!';
  }

  function resetarMensagem() {
    msg.textContent = 'Olá';
  }

  btnClick.addEventListener('click', alterarMensagem);

   btnClick2.addEventListener('click', resetarMensagem);
  // Se tiver mais botões, adicione outros event listeners aqui.
});

function toggleMenu() {
  const menu = document.querySelector('nav ul');
  menu.classList.toggle('active');
}

