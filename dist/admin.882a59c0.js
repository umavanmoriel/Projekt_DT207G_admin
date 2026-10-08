// Eventlistener för att logga ut
const logoutButton = document.getElementById("logout-button");
if (logoutButton) logoutButton.addEventListener("click", ()=>{
    // Tar bort JWT-token från localStorage
    localStorage.removeItem("token");
    // Skickar användaren tillbaka till inloggningssidan
    window.location.href = "./login.html";
});
// Hämtar formuläret från HTML
const form = document.getElementById("dishForm");
// Hämtar elementet där meddelande ska visas
const message = document.getElementById("message");
// Eventlistener för formuläret
form.addEventListener("submit", async (e)=>{
    // Sidan ska inte laddas om när man trycker på formuläret
    e.preventDefault();
    // Hämta vad användaren skrivit i fälten och ta bort mellanslag
    const name = document.getElementById("dishName").value.trim();
    const category = document.getElementById("dishCategory").value;
    const price = document.getElementById("dishPrice").value;
    const description = document.getElementById("dishDescription").value.trim();
    // Validerar att obligatoriska fält är ifyllda
    if (!name || !category || !price) {
        message.textContent = "Fyll i namn, kategori och pris";
        message.className = "message error";
        return;
    }
    try {
        // Skickar en förfrågan till backend med fetch
        const res = await fetch("http://localhost:3000/api/dishes", {
            // POST skickar data till servern
            method: "POST",
            // Skickar JSON
            headers: {
                "Content-Type": "application/json"
            },
            // Skickar med data från formuläret
            body: JSON.stringify({
                name,
                category,
                price: Number(price),
                description
            })
        });
        // Tolkar svaret från servern som JSON
        const data = await res.json();
        // Om servern svarade med ett fel
        if (!res.ok) {
            message.textContent = data.error || "Kunde inte spara r\xe4tten";
            message.className = "message error";
            return;
        }
        // Visar ett lyckat meddelande
        message.textContent = "R\xe4tten sparades!";
        message.className = "message success";
        // Tömmer formuläret så man kan lägga till fler rätter
        form.reset();
    // Om något gick fel
    } catch (error) {
        // Skriv ut felet i konsolen
        console.error("Fel vid sparande:", error.message);
        // Visar ett felmeddelande för användaren
        message.textContent = "Kunde inte n\xe5 server";
        message.className = "message error";
    }
});

//# sourceMappingURL=admin.882a59c0.js.map
