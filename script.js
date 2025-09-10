const animeList = document.getElementById("anime-list");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const randomBtn = document.getElementById("randomBtn");
const suggestionsBox = document.getElementById("suggestions");
const recommendedList = document.getElementById("recommended-list");

// 🔹 Fetch anime by search
async function fetchAnime(query) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=8`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

// 🔹 Fetch random anime
async function fetchRandomAnime() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/random/anime");
    const data = await response.json();
    return [data.data];
  } catch (error) {
    console.error("Error fetching random anime:", error);
    return [];
  }
}

// 🔹 Fetch recommendations for anime by ID
async function fetchRecommendations(animeId) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}

// 🔹 Display anime results
function displayAnime(list) {
  animeList.innerHTML = "";
  if (!list || list.length === 0) {
    animeList.innerHTML = "<p>No results found.</p>";
    return;
  }
  list.forEach(anime => {
    const card = document.createElement("div");
    card.classList.add("anime-card");
    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <h3>${anime.title}</h3>
      <p>${anime.type || "Unknown"} • ${anime.episodes || "?"} eps</p>
      <p>Score: ${anime.score || "N/A"}</p>
      <a href="${anime.url}" target="_blank">More Info</a>
    `;
    card.addEventListener("click", () => {
      fetchRecommendations(anime.mal_id).then(displayRecommendations);
    });
    animeList.appendChild(card);
  });
}

// 🔹 Show suggestions
function showSuggestions(list) {
  suggestionsBox.innerHTML = "";
  if (!list.length) {
    suggestionsBox.style.display = "none";
    return;
  }
  suggestionsBox.style.display = "block";
  list.forEach(anime => {
    const item = document.createElement("div");
    item.classList.add("suggestion-item");
    item.textContent = anime.title;
    item.addEventListener("click", () => {
      searchInput.value = anime.title;
      suggestionsBox.style.display = "none";
      searchBtn.click();
    });
    suggestionsBox.appendChild(item);
  });
}

// 🔹 Display recommendations
function displayRecommendations(recommendations) {
  recommendedList.innerHTML = "";
  if (!recommendations.length) {
    recommendedList.innerHTML = "<p>No recommendations available.</p>";
    return;
  }
  recommendations.forEach(item => {
    const anime = item.entry;
    const card = document.createElement("div");
    card.classList.add("anime-card");
    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <h3>${anime.title}</h3>
      <p>Score: ${anime.score || "N/A"}</p>
      <a href="${anime.url}" target="_blank">More Info</a>
    `;
    recommendedList.appendChild(card);
  });
}

// 🔹 Event listeners
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query.length > 1) {
    const results = await fetchAnime(query);
    // Filter case-insensitively
    const filtered = results.filter(anime =>
      anime.title.toLowerCase().includes(query)
    );
    showSuggestions(filtered);
  } else {
    suggestionsBox.style.display = "none";
  }
});

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (query) {
    const results = await fetchAnime(query);
    displayAnime(results);
    suggestionsBox.style.display = "none";
  }
});

randomBtn.addEventListener("click", async () => {
  const result = await fetchRandomAnime();
  displayAnime(result);
  suggestionsBox.style.display = "none";
});

// Hide suggestions when clicking outside
document.addEventListener("click", (event) => {
  if (!suggestionsBox.contains(event.target) && event.target !== searchInput) {
    suggestionsBox.style.display = "none";
  }
});
