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
    // If authButtonsContainer is used as a nav-item <li>, render nav-links so they collapse correctly
    const isNavItem = authButtonsContainer.classList && authButtonsContainer.classList.contains('nav-item');
    if (authUser) {
      // If admin, show extra link to visualizar
      const isAdmin = authUser.role === 'admin' || (authUser.email && authUser.email.toLowerCase() === 'admin@gmail.com');
      if (isNavItem) {
        authButtonsContainer.innerHTML = `
          <a href="perfil.html" class="nav-link">Olá, ${escapeHtml(authUser.nome)}</a>
          ${isAdmin ? '<a href="visualizar.html" class="nav-link">Visualizar</a>' : ''}
          <a href="#" id="btn-logout" class="nav-link text-danger">Sair</a>
        `;
      } else {
        authButtonsContainer.innerHTML = `
          <div class="d-flex align-items-center gap-2">
            <span class="text-white me-2">Olá, ${escapeHtml(authUser.nome)}</span>
            ${isAdmin ? '<a href="visualizar.html" class="btn btn-outline-info btn-sm">Visualizar</a>' : ''}
            <a href="perfil.html" class="btn btn-outline-light btn-sm">Perfil</a>
            <button id="btn-logout" class="btn btn-danger btn-sm">Sair</button>
          </div>
        `;
      }
      const logoutBtn = document.getElementById('btn-logout');
      if (logoutBtn) logoutBtn.addEventListener('click', logout);
    } else {
      if (isNavItem) {
        authButtonsContainer.innerHTML = `
          <a href="#" id="btn-entrar" class="nav-link">Entrar</a>
          <a href="cadastro.html" id="btn-cadastrar" class="nav-link">Cadastrar</a>
        `;
      } else {
        authButtonsContainer.innerHTML = `
          <button id="btn-entrar" class="btn btn-outline-light btn-sm me-2">Entrar</button>
          <button id="btn-cadastrar" class="btn btn-light btn-sm">Cadastrar</button>
        `;
      }
      const entrarBtn = document.getElementById('btn-entrar');
      const cadastrarBtn = document.getElementById('btn-cadastrar');
      if (entrarBtn) entrarBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal('login'); });
      if (cadastrarBtn) cadastrarBtn.addEventListener('click', (e) => { if (e) e.preventDefault(); showAuthModal('cadastro'); });
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
                <div class="mb-3">
                  <label for="login-password" class="form-label">Senha</label>
                  <input id="login-password" class="form-control" type="password" required autocomplete="current-password" placeholder="Informe sua senha" />
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
                <div class="mb-3">
                  <label for="cad-senha" class="form-label">Senha</label>
                  <input id="cad-senha" class="form-control" type="password" minlength="6" placeholder="mínimo 6 caracteres" required>
                </div>
                <div class="mb-3">
                  <label for="cad-senha-confirm" class="form-label">Confirme a Senha</label>
                  <input id="cad-senha-confirm" class="form-control" type="password" minlength="6" required>
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
    const senhaEl = document.getElementById('cad-senha');
    const senhaConfirmEl = document.getElementById('cad-senha-confirm');

    const nomeValido = validarNome(nomeEl.value);
    const emailValido = validarEmail(emailEl.value);
    const idadeValida = validarIdade(Number(idadeEl.value));

    const senhaValida = senhaEl && senhaEl.value && senhaEl.value.length >= 6;
    const senhaConfValida = senhaConfirmEl && senhaConfirmEl.value === senhaEl.value;

    if (!nomeValido || !emailValido || !idadeValida || !senhaValida || !senhaConfValida) {
      showAuthAlert('Verifique os campos. Nome (mín 3), email válido e idade (18-120).', 'danger');
      markField(nomeEl, nomeValido); markField(emailEl, emailValido); markField(idadeEl, idadeValida);
      markField(senhaEl, senhaValida); markField(senhaConfirmEl, senhaConfValida);
      return;
    }

    if (usuarios.some(u => u.email.toLowerCase() === emailEl.value.toLowerCase())) {
      showAuthAlert('Este email já está cadastrado.', 'warning');
      markField(emailEl, false);
      return;
    }

    const novo = { nome: nomeEl.value.trim(), email: emailEl.value.trim().toLowerCase(), idade: Number(idadeEl.value), password: senhaEl.value };
    usuarios.push(novo);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    showAuthAlert('Cadastro realizado com sucesso! Você já pode entrar.', 'success');
    formResetCadastro();
  }

  function formResetCadastro() {
    document.getElementById('cad-nome').value = '';
    document.getElementById('cad-email').value = '';
    document.getElementById('cad-idade').value = '';
    const s = document.getElementById('cad-senha');
    const sc = document.getElementById('cad-senha-confirm');
    if (s) s.value = '';
    if (sc) sc.value = '';
    document.querySelectorAll('#formCadastro .form-control').forEach(i => i.classList.remove('is-valid', 'is-invalid'));
  }

  function handleLogin(e) {
    e.preventDefault();
    const emailEl = document.getElementById('login-email');
    const passEl = document.getElementById('login-password');
    const emailValido = validarEmail(emailEl.value);

    if (!emailValido) {
      showAuthAlert('Informe um email válido.', 'danger');
      markField(emailEl, false);
      return;
    }

    const emailNormalized = emailEl.value.trim().toLowerCase();

    // Admin override: admin@gmail.com with password '123'
    if (emailNormalized === 'admin@gmail.com') {
      const senha = passEl ? passEl.value : '';
      if (senha !== '123') {
        showAuthAlert('Senha inválida para o administrador.', 'danger');
        markField(passEl, false);
        return;
      }
      authUser = { nome: 'Administrador', email: 'admin@gmail.com', role: 'admin' };
    } else {
      const user = usuarios.find(u => u.email.toLowerCase() === emailNormalized);
      if (!user) {
        showAuthAlert('Usuário não encontrado. Cadastre-se primeiro.', 'warning');
        markField(emailEl, false);
        return;
      }
      // Require password for all users. If stored user has no password, ask to re-cadastre.
      if (!user.password) {
        showAuthAlert('Este usuário não possui senha cadastrada. Por favor, cadastre-se novamente para definir uma senha.', 'warning');
        markField(emailEl, false);
        return;
      }
      const senha = passEl ? passEl.value : '';
      if (!senha || senha !== user.password) {
        showAuthAlert('Senha inválida.', 'danger');
        markField(passEl, false);
        return;
      }
      authUser = Object.assign({}, user, { role: 'user' });
    }
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
    const senha = document.getElementById('cad-senha');
    const senhaConfirm = document.getElementById('cad-senha-confirm');
    if (nome && email && idade) {
      nome.addEventListener('input', () => markField(nome, validarNome(nome.value)));
      email.addEventListener('input', () => markField(email, validarEmail(email.value)));
      idade.addEventListener('input', () => markField(idade, validarIdade(Number(idade.value))));
      if (senha) senha.addEventListener('input', () => markField(senha, senha.value && senha.value.length >= 6));
      if (senhaConfirm) senhaConfirm.addEventListener('input', () => markField(senhaConfirm, senhaConfirm.value === (senha ? senha.value : '')));
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