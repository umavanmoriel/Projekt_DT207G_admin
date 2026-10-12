// Kör funktionen när sidan laddas
window.onload = init;

function init() {
    // Kontrollera att användaren är inloggad
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "./login.html";
        return;
    }

    // Hämtar och visar alla bokningar
    processBookingData();
}

// Hämtar bokningar från backend
async function getBookingData() {
    try {
        const token = localStorage.getItem("token");

        // Skickar en förfrågan till backend med token
        const response = await fetch("http://localhost:3000/api/bookings", {
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
async function processBookingData() {
    try {
        const result = await getBookingData();
        // Skriver ut datan i konsolen för felsökning
        console.log("Received data:", result);
        // Visar bokningarna i tabellen
        displayBookingData(result);
    } catch (error) {
        // Skriver ut felet i konsolen
        console.error("Error processing data:", error);

        // Visar ett felmeddelande i tabellen
        const bookingList = document.getElementById("bookingList");
        if (bookingList) {
            bookingList.innerHTML = '<tr><td colspan="7" class="error">Kunde inte hämta bokningar!</td></tr>';
        }
    }
}

// Visar bokningarna i tabellen
function displayBookingData(data) {
    const bookingList = document.getElementById("bookingList");
    bookingList.innerHTML = "";

    // Visar meddelande om inga bokningar finns
    if (data.length === 0) {
        bookingList.innerHTML = '<tr><td colspan="7" style="text-align: center;">Inga bokningar finns ännu.</td></tr>';
        return;
    }

    // Loopar igenom alla bokningar
    data.forEach((booking) => {
        // Skapar en ny tabellrad
        const raw = document.createElement("tr");

        // Namn
        const nameElement = document.createElement("td");
        nameElement.textContent = booking.name;
        raw.appendChild(nameElement);

        // Telefonnummer
        const phoneElement = document.createElement("td");
        phoneElement.textContent = booking.phone;
        raw.appendChild(phoneElement);

        // Datum
        const dateElement = document.createElement("td");
        dateElement.textContent = booking.date;
        raw.appendChild(dateElement);

        // Tid
        const timeElement = document.createElement("td");
        timeElement.textContent = booking.time;
        raw.appendChild(timeElement);

        // Antal gäster
        const guestsElement = document.createElement("td");
        guestsElement.textContent = booking.guests;
        raw.appendChild(guestsElement);

        // Meddelande eller tomt
        const messageElement = document.createElement("td");
        messageElement.textContent = booking.message || " ";
        raw.appendChild(messageElement);

        // Visar när bokningen skickades och formaterar till svenskt datum
        const createdElement = document.createElement("td");
        createdElement.textContent = new Date(booking.created).toLocaleDateString("sv-SE");
        raw.appendChild(createdElement);

        // Lägger till raden i tabellen
        bookingList.appendChild(raw);
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