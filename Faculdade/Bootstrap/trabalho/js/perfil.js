// ...existing code...
/*
  perfil.js
  - Preenche os dados da página de perfil a partir de authUser em localStorage
  - Redireciona para home se não estiver autenticado
*/
(() => {
  const nomeEl = document.getElementById('nome-usuario');
  const emailEl = document.getElementById('email-usuario');

  const authUser = JSON.parse(localStorage.getItem('authUser')) || null;
  if (!authUser) {
    location.href = 'home.html';
    return;
  }

  if (nomeEl) nomeEl.textContent = authUser.nome || '—';
  if (emailEl) emailEl.textContent = authUser.email || '—';
})();