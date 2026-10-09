// Kör funktionen när sidan laddas
window.onload = init;

function init() {
    // Kontrollerar att användaren är inloggad
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "./login.html";
        return;
    }

    // Laddar in menyn från databasen
    loadDishes();

    // Kopplar Avbryt-knappen till resetForm
    const cancelButton = document.getElementById("cancelButton");
    if (cancelButton) {
        cancelButton.addEventListener("click", resetForm);
    }
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

// Hämtar formuläret från HTML
const form = document.getElementById("dishForm");

// Hämtar elementet där meddelande ska visas
const message = document.getElementById("message");

// Eventlistener för formuläret
form.addEventListener("submit", async (e) => {
    // Sidan ska inte laddas om när man trycker på formuläret
    e.preventDefault();

    // Hämta rättens id om man ska ändra rätt från databasen
    const id = document.getElementById("dishId").value;

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
        // Bestämmer URL och metod beroende på om man ändrar eller lägger till rätt
        const url = id
            ? `http://localhost:3000/api/dishes/${id}`
            : "http://localhost:3000/api/dishes";
        const method = id ? "PUT" : "POST";

        // Skickar en förfrågan till backend med fetch
        const res = await fetch(url, {
            // PUT uppdaterar och POST lägger till
            method: method,

            // Skickar JSON
            headers: {
                "Content-Type": "application/json"
            },

            // Skickar med data från formuläret
            body: JSON.stringify({ name, category, price: Number(price), description })
        });

        // Tolkar svaret från servern som JSON
        const data = await res.json();

        // Om servern svarade med ett fel
        if (!res.ok) {
            message.textContent = data.error || "Kunde inte spara rätten";
            message.className = "message error";
            return;
        }

        // Visar ett lyckat meddelande beroende på vad man gjorde
        message.textContent = id ? "Rätten uppdaterades!" : "Rätten sparades!";
        message.className = "message success";

        // Återställer formuläret till "lägg till"-läge
        resetForm();

        // Laddar om menyn så ändringen syns direkt
        loadDishes();

    // Om något gick fel
    } catch (error) {
        // Skriver ut felet i konsolen
        console.error("Fel vid sparande:", error.message);

        // Visar ett felmeddelande för användaren
        message.textContent = "Kunde inte nå server";
        message.className = "message error";
    }
});

// Hämtar alla rätter från backend och visar dem i menyn
async function loadDishes() {
    try {
        const token = localStorage.getItem("token");

        // Skickar en förfrågan till backend med fetch
        const res = await fetch("http://localhost:3000/api/dishes", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        // Om token är ogiltig eller har gått ut
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            window.location.href = "./login.html";
            return;
        }

        // Tolkar svaret från servern som JSON
        const data = await res.json();

        // Skriver ut datan i konsolen för felsökning
        console.log("Rätter från API:", data);

        // Visar rätterna i menyn
        displayDishData(data);

    // Om något gick fel
    } catch (error) {
        // Skriver ut felet i konsolen
        console.error("Kunde inte hämta rätter:", error.message);

        // Visar ett felmeddelande i menyn
        const container = document.getElementById("menuContainer");
        if (container) {
            container.innerHTML =
                '<p style="text-align:center;">Kunde inte hämta menyn.</p>';
        }
    }
}

// Visar rätterna grupperade i kategorier
function displayDishData(data) {
    const container = document.getElementById("menuContainer");
    container.innerHTML = "";

    // Visar ett meddelande om inga rätter finns 
    if (!data || data.length === 0) {
        container.innerHTML =
            '<p style="text-align:center;">Inga rätter finns i menyn än</p>';
        return;
    }

    // Definierar kategorier och deras visningsnamn med ordning
    const categories = [
        { key: "starters",    label: "Förrätter" },
        { key: "mainCourses", label: "Varmrätter" },
        { key: "desserts",    label: "Efterrätter" },
        { key: "drinks",      label: "Drycker" }
    ];

    categories.forEach((cat) => {
        // Filtrerar ut rätter i denna kategori
        const dishes = data.filter((d) => d.category === cat.key);

        // Renderar hela kategorisektionen
        const section = document.createElement("section");
        section.className = "menu-category";

        // Rubrik
        const heading = document.createElement("h3");
        heading.className = "menu-category-title";
        heading.textContent = cat.label;
        section.appendChild(heading);

        // Visar ett meddelande om kategorin är tom
        if (dishes.length === 0) {
            const empty = document.createElement("p");
            empty.className = "menu-empty";
            empty.textContent = "Inga rätter i denna kategori.";
            section.appendChild(empty);
        } else {
            // Lista med rätter
            const list = document.createElement("ul");
            list.className = "menu-list";

            dishes.forEach((dish) => {
                list.appendChild(createDishItem(dish));
            });

            section.appendChild(list);
        }

        container.appendChild(section);
    });
}

// Skapar en menyrad för en enskild rätt
function createDishItem(dish) {
    const li = document.createElement("li");
    li.className = "menu-item";

    // Vänster sida: namn och beskrivning
    const info = document.createElement("div");
    info.className = "menu-item-info";

    const header = document.createElement("div");
    header.className = "menu-item-header";

    const name = document.createElement("span");
    name.className = "menu-item-name";
    name.textContent = dish.name;
    header.appendChild(name);

    // Prickade linjer
    const dots = document.createElement("span");
    dots.className = "menu-item-dots";
    header.appendChild(dots);

    // Pris
    const price = document.createElement("span");
    price.className = "menu-item-price";
    price.textContent = dish.price + " kr";
    header.appendChild(price);

    info.appendChild(header);

    // Beskrivning
    if (dish.description) {
        const desc = document.createElement("p");
        desc.className = "menu-item-description";
        desc.textContent = dish.description;
        info.appendChild(desc);
    }

    li.appendChild(info);

    // Höger sida: knappar
    const actions = document.createElement("div");
    actions.className = "menu-item-actions";

    // Ändra knapp
    const editButton = document.createElement("button");
    editButton.textContent = "Ändra";
    editButton.className = "edit-btn";
    editButton.addEventListener("click", () => editDish(dish));
    actions.appendChild(editButton);

    // Radera knapp
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Radera";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => deleteDish(dish._id));
    actions.appendChild(deleteButton);

    li.appendChild(actions);

    return li;
}

// Fyller formuläret med rättens data för att kunna ändra
function editDish(dish) {
    // Sparar rättens id i det dolda fältet
    document.getElementById("dishId").value = dish._id;

    // Fyller formuläret med rättens data
    document.getElementById("dishName").value = dish.name;
    document.getElementById("dishCategory").value = dish.category;
    document.getElementById("dishPrice").value = dish.price;
    document.getElementById("dishDescription").value = dish.description || "";

    // Byter rubrik och knapptext till "ändra" läge
    document.getElementById("formTitle").textContent = "Ändra rätt";
    document.getElementById("submitButton").textContent = "Spara ändringar";
    document.getElementById("cancelButton").style.display = "inline-block";

    // Scrollar upp till formuläret
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Återställer formuläret till "lägg till" läge
function resetForm() {
    // Tömmer formuläret
    form.reset();

    // Tar bort rättens id
    document.getElementById("dishId").value = "";

    // Byter tillbaka rubrik och knapptext
    document.getElementById("formTitle").textContent = "Lägg till rätt";
    document.getElementById("submitButton").textContent = "Lägg till rätt";
    document.getElementById("cancelButton").style.display = "none";

    // Rensar meddelandet
    message.textContent = "";
    message.className = "";
}

// Raderar en rätt från databasen
async function deleteDish(id) {
    // Frågar användaren om de är säkra
    if (!confirm("Är du säker på att du vill radera rätten?")) return;

    try {
        const token = localStorage.getItem("token");

        // Skickar en DELETE förfrågan till backend
        const res = await fetch(`http://localhost:3000/api/dishes/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        // Om servern svarade med ett fel
        if (!res.ok) {
            alert("Kunde inte radera rätten");
            return;
        }

        // Laddar om menyn så rätten försvinner
        loadDishes();

    // Om något gick fel
    } catch (error) {
        // Skriver ut felet i konsolen
        console.error("Fel vid radering:", error.message);

        // Visar ett felmeddelande för användaren
        alert("Kunde inte nå server");
    }
}