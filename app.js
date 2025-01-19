// Supabase configuration
const SUPABASE_URL = "https://fvymmmusiargiibfeuyb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eW1tbXVzaWFyZ2lpYmZldXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczMTM1OTIsImV4cCI6MjA1Mjg4OTU5Mn0.WXMvsI08VyNq4URu-Fz59cDDIsRPHIDoGF2IdP5JaUA";

// Initialize Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elements
const nameForm = document.getElementById("name-form");
const trackerSection = document.getElementById("tracker-section");
const trackerForm = document.getElementById("tracker-form");
const leaderboardTable = document.getElementById("leaderboard").querySelector("tbody");
const userEntriesList = document.getElementById("user-entries");
const displayName = document.getElementById("display-name");

// Global variable for the current user
let currentUser = "";

// Save entry to Supabase
async function saveEntry(entry) {
  const { data, error } = await supabase.from("exercise_entries").insert([entry]);
  if (error) {
    console.error("Error saving entry:", error);
  } else {
    console.log("Entry saved successfully:", data);
  }
}

// Fetch all entries from Supabase
async function loadEntries() {
  const { data, error } = await supabase.from("exercise_entries").select("*");
  if (error) {
    console.error("Error loading entries:", error);
    return [];
  }
  return data;
}

// Fetch leaderboard from Supabase
async function loadLeaderboard() {
  const { data, error } = await supabase
    .from("exercise_entries")
    .select("name, calories_burned")
    .order("calories_burned", { ascending: false });
  if (error) {
    console.error("Error loading leaderboard:", error);
    return [];
  }
  return data;
}

// Refresh user entries
async function refreshUserEntries() {
  const entries = await loadEntries();
  const userEntries = entries.filter((entry) => entry.name === currentUser);

  userEntriesList.innerHTML = "";
  userEntries.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: ${entry.exercise} for ${entry.duration} minutes (${entry.calories_burned} cal)`;
    userEntriesList.appendChild(li);
  });
}

// Refresh leaderboard
async function refreshLeaderboard() {
  const leaderboard = await loadLeaderboard();

  leaderboardTable.innerHTML = "";
  leaderboard.forEach(({ name, calories_burned }) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${name}</td><td>${calories_burned}</td>`;
    leaderboardTable.appendChild(row);
  });
}

// Handle name form submission
nameForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  currentUser = document.getElementById("username").value.trim();

  if (!currentUser) return;

  // Update UI
  displayName.textContent = currentUser;
  nameForm.classList.add("hidden");
  trackerSection.classList.remove("hidden");

  await refreshUserEntries();
  await refreshLeaderboard();
});

// Handle tracker form submission
trackerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const exercise = document.getElementById("exercise").value;
  const customExercise = document.getElementById("custom-exercise").value.trim();
  const duration = parseInt(document.getElementById("duration").value, 10);
  const weight = parseInt(document.getElementById("weight").value, 10);
  const date = document.getElementById("date").value;

  const exerciseType = exercise === "Custom" ? customExercise : exercise;
  const caloriesBurned = Math.round(0.0175 * weight * duration);

  const entry = {
    name: currentUser,
    exercise: exerciseType,
    duration,
    weight,
    calories_burned: caloriesBurned,
    date,
  };

  await saveEntry(entry); // Save to Supabase
  await refreshUserEntries();
  await refreshLeaderboard();
  trackerForm.reset();
});

// Initial leaderboard load
refreshLeaderboard();
