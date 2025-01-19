// Elements
const nameForm = document.getElementById("name-form");
const trackerSection = document.getElementById("tracker-section");
const trackerForm = document.getElementById("tracker-form");
const leaderboardTable = document.getElementById("leaderboard").querySelector("tbody");
const userEntriesList = document.getElementById("user-entries");
const displayName = document.getElementById("display-name");

// Calorie burn rates
const calorieBurnRates = {
  Running: 0.0175 * 10,
  Cycling: 0.0175 * 8,
  Walking: 0.0175 * 3.8,
  Weightlifting: 0.0175 * 6,
  Custom: 0.0175 * 5,
};

// Global variable for the current user
let currentUser = "";

// Load data from localStorage
function loadData() {
  return JSON.parse(localStorage.getItem("healthTrackerData")) || {};
}

// Save data to localStorage
function saveData(data) {
  localStorage.setItem("healthTrackerData", JSON.stringify(data));
}

// Load leaderboard
function loadLeaderboard() {
  const data = loadData();
  const leaderboard = Object.entries(data)
    .map(([name, entries]) => ({
      name,
      totalCalories: entries.reduce((sum, entry) => sum + entry.caloriesBurned, 0),
    }))
    .sort((a, b) => b.totalCalories - a.totalCalories);

  leaderboardTable.innerHTML = "";
  leaderboard.forEach(({ name, totalCalories }) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${name}</td><td>${totalCalories}</td>`;
    leaderboardTable.appendChild(row);
  });
}

// Load user-specific entries
function loadUserEntries() {
  const data = loadData();
  const userEntries = data[currentUser] || [];

  userEntriesList.innerHTML = "";
  userEntries.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: ${entry.exercise} for ${entry.duration} minutes (${entry.caloriesBurned} cal)`;
    userEntriesList.appendChild(li);
  });
}

// Handle name form submission
nameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  currentUser = document.getElementById("username").value.trim();
  if (!currentUser) return;

  // Update UI
  displayName.textContent = currentUser;
  nameForm.classList.add("hidden");
  trackerSection.classList.remove("hidden");

  // Load user's data
  loadUserEntries();
  loadLeaderboard();
});

// Handle tracker form submission
trackerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const exercise = document.getElementById("exercise").value;
  const customExercise = document.getElementById("custom-exercise").value.trim();
  const duration = parseInt(document.getElementById("duration").value, 10);
  const weight = parseInt(document.getElementById("weight").value, 10);
  const dateInput = document.getElementById("date").value;

  const date = dateInput || new Date().toLocaleDateString();
  const exerciseType = exercise === "Custom" ? customExercise : exercise;
  const burnRate = calorieBurnRates[exerciseType] || calorieBurnRates["Custom"];
  const caloriesBurned = Math.round(burnRate * weight * duration);

  // Update data
  const data = loadData();
  if (!data[currentUser]) {
    data[currentUser] = [];
  }
  data[currentUser].push({ exercise: exerciseType, duration, weight, date, caloriesBurned });
  saveData(data);

  // Refresh UI
  loadUserEntries();
  loadLeaderboard();
  trackerForm.reset();
});

// Initialize leaderboard on load
loadLeaderboard();
