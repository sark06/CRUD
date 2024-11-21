document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const updateForm = document.getElementById('updateForm');
    const message = document.getElementById('message');

    let loggedInUser = null;

    // Sign Up
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;

        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        message.textContent = result.message;
    });

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        if (result.success) {
            loggedInUser = result.user;
            loginForm.style.display = 'none';
            updateForm.style.display = 'block';
        }
        message.textContent = result.message;
    });

    // Update Account
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('updateUsername').value;
        const password = document.getElementById('updatePassword').value;

        const response = await fetch('/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: loggedInUser.id, username, password }),
        });

        const result = await response.json();
        message.textContent = result.message;
    });

    // Delete Account
    document.getElementById('deleteAccount').addEventListener('click', async () => {
        const response = await fetch('/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: loggedInUser.id }),
        });

        const result = await response.json();
        if (result.success) {
            loggedInUser = null;
            updateForm.style.display = 'none';
            loginForm.style.display = 'block';
        }
        message.textContent = result.message;
    });
});
