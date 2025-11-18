// ...existing code...
/*
  auth.js
  - Gerencia cadastro, login e estado de sessão (localStorage)
  - Injeta modal de autenticação e atualiza #auth-buttons no navbar
*/
(() => {
  const authButtonsContainer = document.getElementById('auth-buttons');
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  let authUser = JSON.parse(localStorage.getItem('authUser')) || null;

  function validarNome(valor) { return valor.trim().length > 2; }
  function validarEmail(valor) { return typeof valor === 'string' && valor.includes('@') && valor.includes('.'); }
  function validarIdade(valor) { return Number.isInteger(valor) && valor >= 18 && valor <= 120; }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"'`]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;', '`':'&#96;'}[s]));
  }

  function renderAuthButtons() {
    if (!authButtonsContainer) return;
    authButtonsContainer.innerHTML = '';
    if (authUser) {
      authButtonsContainer.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <span class="text-white me-2">Olá, ${escapeHtml(authUser.nome)}</span>
          <a href="perfil.html" class="btn btn-outline-light btn-sm">Perfil</a>
          <button id="btn-logout" class="btn btn-danger btn-sm">Sair</button>
        </div>
      `;
      document.getElementById('btn-logout').addEventListener('click', logout);
    } else {
      authButtonsContainer.innerHTML = `
        <button id="btn-entrar" class="btn btn-outline-light btn-sm me-2">Entrar</button>
        <button id="btn-cadastrar" class="btn btn-light btn-sm">Cadastrar</button>
      `;
      document.getElementById('btn-entrar').addEventListener('click', () => showAuthModal('login'));
      document.getElementById('btn-cadastrar').addEventListener('click', () => showAuthModal('cadastro'));
    }
  }

  function logout() {
    localStorage.removeItem('authUser');
    authUser = null;
    renderAuthButtons();
    if (location.pathname.toLowerCase().endsWith('perfil.html')) {
      location.href = 'home.html';
    }
  }

  function ensureModal() {
    if (document.getElementById('authModal')) return;
    const modalHtml = `
      <div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-light">
            <div class="modal-header">
              <h5 class="modal-title" id="authModalLabel">Autenticação</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
              <div id="auth-alert"></div>

              <ul class="nav nav-tabs mb-3" role="tablist">
                <li class="nav-item"><button class="nav-link active" id="tab-login">Entrar</button></li>
                <li class="nav-item"><button class="nav-link" id="tab-cadastro">Cadastrar</button></li>
              </ul>

              <form id="formLogin" class="auth-form">
                <div class="mb-3">
                  <label for="login-email" class="form-label">Email</label>
                  <input id="login-email" class="form-control" type="email" required>
                </div>
                <div class="d-grid">
                  <button class="btn btn-primary" type="submit">Entrar</button>
                </div>
              </form>

              <form id="formCadastro" class="auth-form d-none">
                <div class="mb-3">
                  <label for="cad-nome" class="form-label">Nome</label>
                  <input id="cad-nome" class="form-control" type="text" required>
                </div>
                <div class="mb-3">
                  <label for="cad-email" class="form-label">Email</label>
                  <input id="cad-email" class="form-control" type="email" required>
                </div>
                <div class="mb-3">
                  <label for="cad-idade" class="form-label">Idade</label>
                  <input id="cad-idade" class="form-control" type="number" min="18" max="120" required>
                </div>
                <div class="d-grid">
                  <button class="btn btn-success" type="submit">Cadastrar</button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('tab-login').addEventListener('click', () => switchAuthTab('login'));
    document.getElementById('tab-cadastro').addEventListener('click', () => switchAuthTab('cadastro'));

    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');
    formCadastro.addEventListener('submit', handleCadastro);
    formLogin.addEventListener('submit', handleLogin);
  }

  function switchAuthTab(tab) {
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.add('d-none'));
    if (tab === 'login') {
      document.getElementById('tab-login').classList.add('active');
      document.getElementById('formLogin').classList.remove('d-none');
    } else {
      document.getElementById('tab-cadastro').classList.add('active');
      document.getElementById('formCadastro').classList.remove('d-none');
    }
    clearAuthAlert();
  }

  function showAuthModal(tab = 'login') {
    ensureModal();
    switchAuthTab(tab);
    const modalEl = document.getElementById('authModal');
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  function showAuthAlert(html, tipo = 'info') {
    const el = document.getElementById('auth-alert');
    if (!el) return;
    el.innerHTML = `<div class="alert alert-${tipo}">${html}</div>`;
  }
  function clearAuthAlert() { const el = document.getElementById('auth-alert'); if (el) el.innerHTML = ''; }

  function handleCadastro(e) {
    e.preventDefault();
    const nomeEl = document.getElementById('cad-nome');
    const emailEl = document.getElementById('cad-email');
    const idadeEl = document.getElementById('cad-idade');

    const nomeValido = validarNome(nomeEl.value);
    const emailValido = validarEmail(emailEl.value);
    const idadeValida = validarIdade(Number(idadeEl.value));

    if (!nomeValido || !emailValido || !idadeValida) {
      showAuthAlert('Verifique os campos. Nome (mín 3), email válido e idade (18-120).', 'danger');
      markField(nomeEl, nomeValido); markField(emailEl, emailValido); markField(idadeEl, idadeValida);
      return;
    }

    if (usuarios.some(u => u.email.toLowerCase() === emailEl.value.toLowerCase())) {
      showAuthAlert('Este email já está cadastrado.', 'warning');
      markField(emailEl, false);
      return;
    }

    const novo = { nome: nomeEl.value.trim(), email: emailEl.value.trim().toLowerCase(), idade: Number(idadeEl.value) };
    usuarios.push(novo);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    showAuthAlert('Cadastro realizado com sucesso! Você já pode entrar.', 'success');
    formResetCadastro();
  }

  function formResetCadastro() {
    document.getElementById('cad-nome').value = '';
    document.getElementById('cad-email').value = '';
    document.getElementById('cad-idade').value = '';
    document.querySelectorAll('#formCadastro .form-control').forEach(i => i.classList.remove('is-valid', 'is-invalid'));
  }

  function handleLogin(e) {
    e.preventDefault();
    const emailEl = document.getElementById('login-email');
    const emailValido = validarEmail(emailEl.value);

    if (!emailValido) {
      showAuthAlert('Informe um email válido.', 'danger');
      markField(emailEl, false);
      return;
    }

    const user = usuarios.find(u => u.email.toLowerCase() === emailEl.value.trim().toLowerCase());
    if (!user) {
      showAuthAlert('Usuário não encontrado. Cadastre-se primeiro.', 'warning');
      markField(emailEl, false);
      return;
    }

    authUser = user;
    localStorage.setItem('authUser', JSON.stringify(authUser));
    showAuthAlert(`Bem-vindo, ${escapeHtml(authUser.nome)}!`, 'success');

    setTimeout(() => {
      const modalEl = document.getElementById('authModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
      renderAuthButtons();
    }, 700);
  }

  function markField(inputEl, valido) {
    if (!inputEl) return;
    inputEl.classList.remove('is-valid', 'is-invalid');
    inputEl.classList.add(valido ? 'is-valid' : 'is-invalid');
  }

  function initValidation() {
    const nome = document.getElementById('cad-nome');
    const email = document.getElementById('cad-email');
    const idade = document.getElementById('cad-idade');
    if (nome && email && idade) {
      nome.addEventListener('input', () => markField(nome, validarNome(nome.value)));
      email.addEventListener('input', () => markField(email, validarEmail(email.value)));
      idade.addEventListener('input', () => markField(idade, validarIdade(Number(idade.value))));
    }
  }

  renderAuthButtons();

  document.body.addEventListener('click', function onBodyClick(e) {
    if (e.target.matches('#btn-entrar') || e.target.matches('#btn-cadastrar')) {
      setTimeout(() => {
        initValidation();
      }, 50);
    }
  });

})();