// Elements
const trackerForm = document.getElementById("tracker-form");
const leaderboardTable = document.getElementById("leaderboard").querySelector("tbody");

// Calorie burn rates (calories per minute per pound)
const calorieBurnRates = {
  Running: 0.0175 * 10,
  Cycling: 0.0175 * 8,
  Walking: 0.0175 * 3.8,
  Weightlifting: 0.0175 * 6,
  Custom: 0.0175 * 5, // Default rate for custom exercises
};

// Load leaderboard from localStorage
function loadLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardTable.innerHTML = "";

  leaderboard
    .sort((a, b) => b.calories - a.calories) // Sort by calories in descending order
    .forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${entry.name}</td><td>${entry.calories}</td>`;
      leaderboardTable.appendChild(row);
    });
}

// Save leaderboard to localStorage
function saveLeaderboard(leaderboard) {
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// Handle form submission
trackerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const exercise = document.getElementById("exercise").value;
  const duration = parseInt(document.getElementById("duration").value, 10);
  const weight = parseInt(document.getElementById("weight").value, 10);

  if (!name || !duration || !weight) {
    alert("Please fill out all fields.");
    return;
  }

  // Calculate calories burned
  const burnRate = calorieBurnRates[exercise] || calorieBurnRates["Custom"];
  const caloriesBurned = Math.round(burnRate * weight * duration);

  // Update leaderboard
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const userEntry = leaderboard.find((entry) => entry.name === name);

  if (userEntry) {
    userEntry.calories += caloriesBurned;
  } else {
    leaderboard.push({ name, calories: caloriesBurned });
  }

  saveLeaderboard(leaderboard);
  loadLeaderboard();

  // Reset the form
  trackerForm.reset();
});

// Initialize the leaderboard
loadLeaderboard();
