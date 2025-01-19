// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Elements
const nameForm = document.getElementById("name-form");
const trackerSection = document.getElementById("tracker-section");
const trackerForm = document.getElementById("tracker-form");
const leaderboardTable = document.getElementById("leaderboard").querySelector("tbody");
const userEntriesList = document.getElementById("user-entries");
const displayName = document.getElementById("display-name");

// Global variable for the current user
let currentUser = "";

// Load leaderboard
async function loadLeaderboard() {
  const leaderboard = [];
  const snapshot = await db.collection("users").get();

  for (const doc of snapshot.docs) {
    const userId = doc.id;
    const entriesSnapshot = await db.collection("users").doc(userId).collection("entries").get();

    const totalCalories = entriesSnapshot.docs.reduce((sum, entry) => {
      return sum + entry.data().caloriesBurned;
    }, 0);

    leaderboard.push({ name: userId, totalCalories });
  }

  leaderboard.sort((a, b) => b.totalCalories - a.totalCalories);

  leaderboardTable.innerHTML = "";
  leaderboard.forEach(({ name, totalCalories }) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${name}</td><td>${totalCalories}</td>`;
    leaderboardTable.appendChild(row);
  });
}

// Load user entries
async function loadUserEntries() {
  const entries = [];
  const snapshot = await db.collection("users").doc(currentUser).collection("entries").get();

  snapshot.forEach((doc) => {
    entries.push(doc.data());
  });

  userEntriesList.innerHTML = "";
  entries.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: ${entry.exercise} for ${entry.duration} minutes (${entry.caloriesBurned} cal)`;
    userEntriesList.appendChild(li);
  });
}

// Save an entry
async function saveEntry(entry) {
  await db.collection("users").doc(currentUser).collection("entries").add(entry);
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

  await loadUserEntries();
  await loadLeaderboard();
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
    exercise: exerciseType,
    duration,
    weight,
    date,
    caloriesBurned
  };

  await saveEntry(entry);
  await loadUserEntries();
  await loadLeaderboard();
  trackerForm.reset();
});

// Load leaderboard on page load
loadLeaderboard();
