const passwordInput = document.querySelector('#staff-password');
const passwordToggle = document.querySelector('#toggle-staff-password');

passwordToggle.addEventListener('click', () => {
    const showingPassword = passwordInput.type === 'text';
    passwordInput.type = showingPassword ? 'password' : 'text';
    passwordToggle.setAttribute('aria-label', showingPassword ? 'Mostrar senha' : 'Ocultar senha');
    passwordToggle.setAttribute('aria-pressed', String(!showingPassword));
    passwordToggle.textContent = showingPassword ? '👁' : '🙈';
});