let data = [];

// Cargar desde localstorage
document.addEventListener("DOMContentLoaded", async () => {
  if (!localStorage.getItem("data")) {
    const req = await fetch("./data.json");
    data = await req.json();
  } else {
    data = JSON.parse(localStorage.getItem("data"));
  }

  updateData();
});

// Agregar Cartas
const form = document.querySelector("#register");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const cardNumber = formData.get("card-number");
  const card = formData.get("card");

  const itemExists = data.find((item) => {
    return item.number == cardNumber && item.card == card;
  });

  if (itemExists) {
    alert("La carta se encuentra repetida");
    return;
  }

  data.push({
    number: cardNumber,
    card,
    quantity: 1,
  });

  updateData();
});

// Funcion que debe ser ejecutada cada vez que se modifique el arreglo
function updateData() {
  // Guardar Cambios
  localStorage.setItem("data", JSON.stringify(data));

  // Mostrar cambios en pantalla
  printData(data);
}

// Mostrar Datos
function printData() {
  const imgContainer = document.querySelector("#img-cards");
  const table = document.querySelector("#table-cards");

  imgContainer.innerHTML = "";
  table.innerHTML = "";

  // Ordenar por Cantidad
  data.sort((a, b) => {
    return b.quantity - a.quantity;
  });

  for (const item of data) {
    addCardOnTable(item);
  }

  // Ordenar por nombre
  data.sort((a, b) => {
    if (a.number !== b.number) {
      return b.number - a.number;
    }

    const priority = {
      diamond: 1,
      spades: 2,
      heart: 3,
      club: 4,
    };

    return priority[a.card] - priority[b.card];
  });

  for (const item of data) {
    addCardImg(item);
  }
}

function addCardImg(item) {
  const imgContainer = document.querySelector("#img-cards");
  const img = document.createElement("img");
  img.src = `./img/${item.card}-${item.number}.png`;
  imgContainer.appendChild(img);
  img.classList.add("image-section__img");

  img.addEventListener("click", () => {
    item.quantity++;

    updateData();
  });
}

function addCardOnTable(item) {
  const cardValues = {
    diamond: "Diamante",
    heart: "Corazón",
    club: "Trebol",
    spades: "Pica",
  };

  const numberValues = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

  const table = document.querySelector("#table-cards");
  const tr = document.createElement("tr");
  tr.innerHTML = `
      <td>${numberValues[item.number]}</td>
      <td>${cardValues[item.card]}</td>
      <td>${item.quantity}</td>
  `;

  table.appendChild(tr);
}
