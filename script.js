const categorySelect = document.getElementById("category");
const optionInput = document.getElementById("option-input");
const addBtn = document.getElementById("add-btn");
const doneBtn = document.getElementById("done-btn");
const optionsList = document.getElementById("options-list");
const popup = document.getElementById("popup");
const categoryTitle = document.getElementById("category-title");
const itemStrip = document.getElementById("item-strip");
const randomizeBtn = document.getElementById("randomize-btn");
const finalResult = document.getElementById("final-result");
const closeBtn = document.getElementById("close-btn");
const errorMessage = document.getElementById("error-message");

const categoryButtons = document.querySelectorAll("#category button");

let options = [];
let currentCategory = "";

categoryButtons.forEach(btn => {
  btn.addEventListener("click", async () => {
    currentCategory = btn.id;
    options = [];
    
    await loadCategory(currentCategory);
    openPopup(currentCategory);
  });
});

async function loadCategory(cat) {
  try {
    if (cat === "activities") {
			const res = await fetch("./json/activities.json");
			const data = await res.json();
			options = data.activities.map(activity => activity.name);
    } else if (cat === "food") {
			const res = await fetch(`./json/food.json`);
			const data = await res.json();
			options = data.foods.map(food => food.name);
    } else if (cat === "movies") {
			const res = await fetch("/api/tmdb");
			const data = await res.json();
			options = data.results.map(movie => movie.title);
    } else if (cat === "places") {
      const res = await fetch("./json/places.json");
			const data = await res.json();
			options = data.places.map(place => place.name);
    } else if (cat === "books") {
			const res = await fetch("/api/books");
			const data = await res.json();
			options = data.items.map(item => item.volumeInfo.title);
    } else if (cat === "games") {
			const res = await fetch("/api/games");
			const data = await res.json();
			options = data.slice(0, 30).map(game => game.title);
    } else if (cat === "music") {
			const res = await fetch(`https://itunes.apple.com/us/rss/topsongs/limit=30/json`);
			const data = await res.json();
			options = data.feed.entry.map(entry => entry["im:name"].label);
		} else if (cat === "sport") {
			const res = await fetch("./json/sports.json");
			const data = await res.json();
			options = data.sports.map(sport => sport.name);
		} else if (cat === "cars") {
			const res = await fetch("./json/cars.json");
			const data = await res.json();
			options = data.cars.map(car => car.name);
		} else if (cat === "color") {
			const res = await fetch("./json/colors.json");
			const data = await res.json();
			options = data.colors.map(color => color.name);
		} else if (cat === "fruits") {
			const res = await fetch("./json/fruits.json");
			const data = await res.json();
			options = data.fruits.map(fruit => fruit.name);
		}
  } catch (err) {
    errorMessage.textContent = "Failed to fetch ideas. Try again!";
    errorMessage.classList.remove("hidden");
  }
}

function openPopup(categoryName) {
  categoryTitle.textContent = `Category: ${categoryName}`;
  finalResult.textContent = "";

  renderPopupList();
	renderWheel();
  popup.style.display = "block";
}

function renderPopupList() {
  const listContainer = document.getElementById("option-list");
  listContainer.innerHTML = options
    .map((opt, index) => `
      <div class="popup-item">
        <span>${opt}</span>
        <button class="popup-remove" data-index="${index}">✖</button>
      </div>
    `)
    .join("");

  document.querySelectorAll(".popup-remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"));
      options.splice(index, 1);
      renderPopupList(); 
			renderWheel();
			stopSpin();
    });
  });
}

function renderWheel() {
  itemStrip.innerHTML = options.map(opt => `<div class="item">${opt}</div>`).join("");

  if (options.length === 0) {
    itemStrip.innerHTML = `<div class="item empty">No items yet</div>`;
  }
}

const popupAddBtn = document.getElementById("popup-add-btn");
const popupInput = document.getElementById("popup-input");

popupAddBtn.addEventListener("click", () => {
  const val = popupInput.value.trim();
  if (!val) return;
  options.push(val);
  popupInput.value = "";
  renderPopupList();
	renderWheel();
	stopSpin();
});

popupInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    popupAddBtn.click();
  }
});

let wheelSound = null;
let spinTimeout = null;

randomizeBtn.addEventListener("click", async () => {
  if (options.length === 0) {
		alert("No items to choose from! Please add some options first.");
    return;
	}

	if (spinTimeout) return;

  // document.getElementById("option-list").innerHTML = options
  //   .map(opt => `<span>${opt}</span>`)
  //   .join("");

  const repeats = 10;
  const repeatedOptions = Array(repeats).fill(options).flat();
  itemStrip.innerHTML = repeatedOptions.map(opt => `<div class="item">${opt}</div>`).join("");

  void itemStrip.offsetWidth;

  const items = Array.from(document.querySelectorAll(".item"));
  const rouletteWidth = document.querySelector(".roulette").offsetWidth;

  const itemPositions = [];
  let currentX = 0;
  items.forEach((el, i) => {
    const width = el.offsetWidth + 10;
    itemPositions.push({ index: i, x: currentX, width });
    currentX += width;
  });

  const middleStart = Math.floor(options.length * 2);
  const randomIndex = middleStart + Math.floor(Math.random() * options.length);
  const chosen = itemPositions[randomIndex];

  const itemCenter = chosen.x + chosen.width / 2;
  const visibleCenter = rouletteWidth / 2;
  const stopOffset = -(itemCenter - visibleCenter);

  itemStrip.style.transition = "none";
  itemStrip.style.transform = "translateX(0px)";
  void itemStrip.offsetWidth;

  wheelSound = new Audio("wheel.mp3");
  wheelSound.volume = 0.6;
  wheelSound.loop = true;
  try {
    await wheelSound.play();
  } catch (err) {
    console.warn("Autoplay prevented:", err);
  }

	// Start the spin
  const spinDuration = 6000;
  itemStrip.style.transition = `transform ${spinDuration}ms cubic-bezier(0.05, 0.8, 0.1, 1)`;
  itemStrip.style.transform = `translateX(${stopOffset}px)`;

  spinTimeout = setTimeout(() => {
    if (wheelSound) {
      wheelSound.pause();
      wheelSound.currentTime = 0;
    }
    finalResult.textContent = `🎉 You got: ${repeatedOptions[randomIndex]}!`;
		spinTimeout = null;
  }, spinDuration);
});

function stopSpin() {
	if (spinTimeout) {
    clearTimeout(spinTimeout);
    spinTimeout = null;
  }

  if (wheelSound) {
    wheelSound.pause();
    wheelSound.currentTime = 0;
  }

	itemStrip.style.transition = "none";
  itemStrip.style.transform = "translateX(0px)";
  finalResult.textContent = "";
}

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
  errorMessage.classList.add("hidden");
	
	stopSpin();
});

popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
    errorMessage.classList.add("hidden");

    stopSpin();
  }
});
