// Kör funktionen när sidan laddas
window.onload = init;

function init() {
    // Kontrollera att användaren är inloggad
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "./login.html";
        return;
    }

    // Hämtar och visar alla meddelanden
    processMessageData();
}

// Hämtar meddelanden från backend
async function getMessageData() {
    try {
        const token = localStorage.getItem("token");

        // Skickar en förfrågan till backend med token
        const response = await fetch("http://localhost:3000/api/messages", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        // Om token är ogiltig eller har gått ut
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            window.location.href = "./login.html";
            return;
        }

        // Tolkar svaret från servern som JSON
        const data = await response.json();
        return data;
    } catch (error) {
        // Skriver ut felet i konsolen
        console.error("Fetch error:", error);
        throw error;
    }
}

// Bearbetar datan från backend
async function processMessageData() {
    try {
        const result = await getMessageData();
        // Skriver ut datan i konsolen för felsökning
        console.log("Received data:", result);
        // Visar meddelandena i tabellen
        displayMessageData(result);
    } catch (error) {
        // Skriver ut felet i konsolen
        console.error("Error processing data:", error);

        // Visar ett felmeddelande i tabellen
        const messageList = document.getElementById("messageList");
        if (messageList) {
            messageList.innerHTML = '<tr><td colspan="5" class="error">Kunde inte hämta meddelanden!</td></tr>';
        }
    }
}

// Visar meddelandena i tabellen
function displayMessageData(data) {
    const messageList = document.getElementById("messageList");
    messageList.innerHTML = "";

    // Visar meddelande om inga meddelanden finns
    if (data.length === 0) {
        messageList.innerHTML = '<tr><td colspan="5" style="text-align: center;">Inga meddelanden finns ännu.</td></tr>';
        return;
    }

    // Loopar igenom alla meddelanden
    data.forEach((msg) => {
        // Skapar en ny tabellrad
        const raw = document.createElement("tr");

        // Namn
        const nameElement = document.createElement("td");
        nameElement.textContent = msg.name;
        raw.appendChild(nameElement);

        // E-post
        const emailElement = document.createElement("td");
        emailElement.textContent = msg.email;
        raw.appendChild(emailElement);

        // Ämne eller tomt
        const subjectElement = document.createElement("td");
        subjectElement.textContent = msg.subject || "–";
        raw.appendChild(subjectElement);

        // Meddelande
        const messageElement = document.createElement("td");
        messageElement.textContent = msg.message;
        raw.appendChild(messageElement);

        // Visar när meddelandet skickades och formaterar till svenskt datum
        const createdElement = document.createElement("td");
        createdElement.textContent = new Date(msg.created).toLocaleDateString("sv-SE");
        raw.appendChild(createdElement);

        // Lägger till raden i tabellen
        messageList.appendChild(raw);
    });
}

// Eventlistener för att logga ut
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        // Tar bort JWT-token från localStorage
        localStorage.removeItem("token");
        // Skickar användaren tillbaka till inloggningssidan
        window.location.href = "./login.html";
    });
}