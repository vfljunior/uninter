// Simulação de autenticação - em produção, usar Firebase Auth ou um backend real
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logout');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Verificação simples - em produção, usar autenticação real
            if (email && password) {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userEmail', email);
                window.location.href = 'dashboard.html';
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }
            
            // Salvar no "banco de dados" local (simulação)
            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push({ name, email, password, isAdmin: true });
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            window.location.href = 'index.html';
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userEmail');
            window.location.href = 'index.html';
        });
    }
    
    // Verificar autenticação em páginas protegidas
    if (window.location.pathname.includes('dashboard.html') && !localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
    }
});