// login.js — autentica o formulário em login.html e redireciona para cadastro.html quando ok
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('formLogin');
    if (!form) return;

    function validarEmail(v){ return typeof v === 'string' && v.includes('@') && v.includes('.'); }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      const emailEl = document.getElementById('emailLogin');
      const passEl = document.getElementById('senhaLogin');
      const email = emailEl ? String(emailEl.value).trim().toLowerCase() : '';
      const senha = passEl ? String(passEl.value) : '';

      if (!validarEmail(email)) { alert('Informe um email válido.'); if (emailEl) emailEl.focus(); return; }
      if (!senha) { alert('Informe sua senha.'); if (passEl) passEl.focus(); return; }

      // Admin hardcoded
      if (email === 'admin@gmail.com'){
        if (senha === '123'){
          const authUser = { nome: 'Administrador', email: 'admin@gmail.com', role: 'admin' };
          localStorage.setItem('authUser', JSON.stringify(authUser));
          location.href = 'cadastro.html';
          return;
        } else {
          alert('Senha incorreta para administrador.');
          return;
        }
      }

      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const user = usuarios.find(u => u.email && u.email.toLowerCase() === email);
      if (!user){ alert('Usuário não encontrado. Cadastre-se primeiro.'); return; }
      if (!user.password){ alert('Este usuário não possui senha. Refaça o cadastro para definir uma senha.'); return; }
      if (user.password !== senha){ alert('Senha inválida.'); return; }

      const authUser = Object.assign({}, user, { role: 'user' });
      localStorage.setItem('authUser', JSON.stringify(authUser));
      // redireciona para cadastro.html conforme requisito do trabalho
      location.href = 'cadastro.html';
    });
  });
})();
