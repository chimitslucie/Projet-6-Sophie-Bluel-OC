let formLogin = document.querySelector(".form");
let error = document.querySelector(".error")


formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let user = {
        email: email,
        password: password,
    };

    let response = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    if (response.ok) {
        let result = await response.json();
        localStorage.setItem('token', result.token);
        window.location.href = './index.html';
    } else {
       error.textContent = `nom d'utilisateur ou mot de passe incorrect`
    }
});