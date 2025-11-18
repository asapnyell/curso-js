// visualizar.js — popula a tabela de usuários e permite remoção, busca e exportar CSV
(function(){
  // Protege a página: apenas admin pode visualizar
  const authUser = JSON.parse(localStorage.getItem('authUser')) || null;
  if (!authUser || (authUser.email || '').toLowerCase() !== 'admin@gmail.com') {
    alert('Acesso restrito: apenas o administrador pode acessar esta página.');
    location.href = 'home.html';
    return;
  }

  const tbody = document.querySelector('#usuarios-table tbody');
  const table = document.querySelector('#usuarios-table');
  if (!tbody || !table) return;

  // Injetar controles (busca / exportar) acima da tabela, se ainda não existirem
  let controls = document.querySelector('#usuarios-controls');
  if (!controls){
    controls = document.createElement('div');
    controls.id = 'usuarios-controls';
    controls.className = 'd-flex gap-2 mb-3 justify-content-between align-items-center';
    controls.innerHTML = `
      <div class="d-flex gap-2 w-100">
        <input id="user-search" class="form-control" placeholder="Buscar por nome ou email..." />
        <button id="refresh-list" class="btn btn-outline-secondary">Atualizar</button>
      </div>
    `;
    table.parentElement.parentElement.insertBefore(controls, table.parentElement);
  }

  const inputSearch = document.getElementById('user-search');
  const btnRefresh = document.getElementById('refresh-list');

  function escapeHtml(s){ return String(s).replace(/[&<>'\"`]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c])); }

  function getUsers(){
    return JSON.parse(localStorage.getItem('usuarios')) || [];
  }

  // Renderiza a tabela filtrando por termo opcional
  function render(filter){
    const users = getUsers();
    const term = (filter || '').trim().toLowerCase();
    const filtered = term ? users.filter(u => (u.nome || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term)) : users;

    if (!filtered.length){
      tbody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum usuário cadastrado.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map((u,i)=> `
      <tr>
        <td>${escapeHtml(u.nome || '')}</td>
        <td>${escapeHtml(u.email || '')}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-danger btn-remove" data-email="${escapeHtml(u.email || '')}">Remover</button>
        </td>
      </tr>
    `).join('');

    // Atachar handlers (usamos email como identificador para evitar problemas de índices após filtro)
    document.querySelectorAll('.btn-remove').forEach(b=> b.addEventListener('click', onRemoveClick));
  }

  function onRemoveClick(e){
    const email = e.currentTarget.dataset.email;
    if (!email) return;
    ensureConfirmModal();
    showConfirmModal('Confirma remover o usuário com o email: ' + email + '?', () => {
      const users = getUsers();
      const idx = users.findIndex(u => u.email === email);
      if (idx === -1) return alert('Usuário não encontrado no armazenamento.');
      users.splice(idx,1);
      localStorage.setItem('usuarios', JSON.stringify(users));
      render(inputSearch.value);
    });
  }


  // debounce util
  function debounce(fn, wait){
    let t; return function(...args){ clearTimeout(t); t = setTimeout(()=> fn.apply(this,args), wait); };
  }

  // Confirm modal utilities (Bootstrap)
  function ensureConfirmModal(){
    if (document.getElementById('confirmModal')) return;
    const modalHtml = `
      <div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmação</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body" id="confirmModalBody"></div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" id="confirmModalBtn" class="btn btn-danger">Remover</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  function showConfirmModal(message, onConfirm){
    const body = document.getElementById('confirmModalBody');
    const btn = document.getElementById('confirmModalBtn');
    const modalEl = document.getElementById('confirmModal');
    if (!body || !btn || !modalEl) return;
    body.textContent = message;
    const bsModal = new bootstrap.Modal(modalEl);
    // attach one-time handler
    const handler = () => { try { onConfirm && onConfirm(); } finally { bsModal.hide(); } };
    btn.addEventListener('click', handler, { once: true });
    bsModal.show();
  }

  // Eventos
  inputSearch.addEventListener('input', debounce(()=> render(inputSearch.value), 200));
  btnRefresh.addEventListener('click', ()=> render(inputSearch.value));

  // Inicial
  render();
})();
