function displayDishData(data) {
    const container = document.getElementById("menuContainer");
    container.innerHTML = "";
    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align:center;">Inga r\xe4tter finns i menyn \xe4n.</p>';
        return;
    }
    // Definiera kategorier och deras visningsnamn + ordning
    const categories = [
        {
            key: "starters",
            label: "F\xf6rr\xe4tter"
        },
        {
            key: "mainCourses",
            label: "Varmr\xe4tter"
        },
        {
            key: "desserts",
            label: "Efterr\xe4tter"
        },
        {
            key: "drinks",
            label: "Drycker"
        }
    ];
    categories.forEach((cat)=>{
        // Filtrera ut rätter i denna kategori
        const dishes = data.filter((d)=>d.category === cat.key);
        // Rendera hela kategorisektionen
        const section = document.createElement("section");
        section.className = "menu-category";
        // Rubrik
        const heading = document.createElement("h3");
        heading.className = "menu-category-title";
        heading.textContent = cat.label;
        section.appendChild(heading);
        if (dishes.length === 0) {
            const empty = document.createElement("p");
            empty.className = "menu-empty";
            empty.textContent = "Inga r\xe4tter i denna kategori.";
            section.appendChild(empty);
        } else {
            // Lista med rätter
            const list = document.createElement("ul");
            list.className = "menu-list";
            dishes.forEach((dish)=>{
                list.appendChild(createDishItem(dish));
            });
            section.appendChild(list);
        }
        container.appendChild(section);
    });
}
// Skapa en menyrad för en enskild rätt
function createDishItem(dish) {
    const li = document.createElement("li");
    li.className = "menu-item";
    // Vänster sida: namn + beskrivning
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
    const editButton = document.createElement("button");
    editButton.textContent = "\xc4ndra";
    editButton.className = "edit-btn";
    editButton.addEventListener("click", ()=>editDish(dish));
    actions.appendChild(editButton);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Radera";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", ()=>deleteDish(dish._id));
    actions.appendChild(deleteButton);
    li.appendChild(actions);
    return li;
}

//# sourceMappingURL=admin.c6002a34.js.map
