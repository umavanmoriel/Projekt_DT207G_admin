// Hämta formuläret från HTML
const form = document.getElementById("loginForm");

// Hämta elementet där meddelande ska visas
const message = document.getElementById("message");

// Eventlistener
form.addEventListener("submit", async (e) => {
    //Sidan ska inte laddas om när man trycket på formuläret
    e.preventDefault();

    // Hämta vad användaren skrivit i fälten och ta bort mellanslag i början och i slutet
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Validera att båda fälten är inte tomma
    if (!username || !password) {
        message.textContent = "Fyll i både användarnamn och lösenord";
        message.className = "message error";
        return;
    }

    try {

        // Skicka en förfrågan till backend med fetch
        const res = await fetch("http://localhost:3000/api/login", {

            // POST skickar data till servern
            method: "POST",

            // Skickar JSON
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            message.textContent = data.error || "Inloggningen misslyckades";
            message.className = "message error";
            return;
        }

        // Sparar JWT-token i localStorage för att användaren ska fortsätta vara inloggad
        localStorage.setItem("token", data.token);

        // Visar ett lyckat meddelande
        message.textContent = "Inloggningen lyckades!";
        message.className = "message success";

        // Användaren skickas till admin.html
        setTimeout(() => { 
            window.location.href = "./admin.html";
        }, 200);

    //Om något gick fel
    } catch (error) {

        // Skriv ut felet i konsolen
        console.error("Fel vid inloggning:", error.message);

        // Visar ett felmeddelande för användaren
        message.textContent = "Kunde inte nå server";
        message.className = "message error";
    }
});

// Eventlistener för att logga ut
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "./login.html";
    });
}