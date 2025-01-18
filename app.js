// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQK4TSZ3V4j1k8ynOY_8dSVFY3yIW8LFY",
  authDomain: "exercise-health-tracker.firebaseapp.com",
  projectId: "exercise-health-tracker",
  storageBucket: "exercise-health-tracker.appspot.com",
  messagingSenderId: "28861689607",
  appId: "1:28861689607:web:b9c299de0db98ebb6e9fa2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Log Firebase initialization success
console.log("Firebase initialized successfully");

// Elements
const trackerForm = document.getElementById('tracker-form');
const entriesList = document.getElementById('entries-list');

// Calorie burn rates (calories burned per minute per pound)
const calorieBurnRates = {
  Running: 0.0175 * 10,
  Cycling: 0.0175 * 8,
  Walking: 0.0175 * 3.8,
  Weightlifting: 0.0175 * 6,
  Custom: 0.0175 * 5, // Default rate for custom exercises
};

// Calculate calories burned
function calculateCalories(exercise, duration, weight) {
  const burnRate = calorieBurnRates[exercise] || calorieBurnRates["Custom"];
  return Math.round(burnRate * weight * duration);
}

// Save entry to Firestore
async function saveEntry(entry) {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to save an entry!");
    return;
  }

  try {
    await db.collection("users").doc(user.uid).collection("entries").add(entry);
    console.log("Entry saved successfully:", entry);
    loadEntries(); // Refresh the entries list
  } catch (error) {
    console.error("Error saving entry:", error);
    alert("Failed to save entry. Please try again.");
  }
}

// Load entries from Firestore
async function loadEntries() {
  const user = auth.currentUser;
  if (!user) {
    entriesList.innerHTML = "<p>Please log in to view your entries.</p>";
    return;
  }

  try {
    const snapshot = await db.collection("users").doc(user.uid).collection("entries").get();
    entriesList.innerHTML = ""; // Clear the list before appending

    snapshot.forEach((doc) => {
      const entry = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <span><strong>${entry.date}</strong>: ${entry.exercise} for ${entry.duration} minutes (${entry.caloriesBurned} cal)</span>
        <button data-id="${doc.id}" class="delete-btn">Delete</button>
      `;
      entriesList.appendChild(li);
    });

    // Add delete functionality
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const entryId = e.target.getAttribute("data-id");
        deleteEntry(entryId);
      });
    });
  } catch (error) {
    console.error("Error loading entries:", error);
    alert("Failed to load entries. Please try again.");
  }
}

// Delete entry from Firestore
async function deleteEntry(entryId) {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to delete an entry!");
    return;
  }

  try {
    await db.collection("users").doc(user.uid).collection("entries").doc(entryId).delete();
    console.log("Entry deleted successfully:", entryId);
    loadEntries(); // Refresh the entries list
  } catch (error) {
    console.error("Error deleting entry:", error);
    alert("Failed to delete entry. Please try again.");
  }
}

// Handle form submission
trackerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const exercise = document.getElementById("exercise").value;
  const customExercise = document.getElementById("custom-exercise").value;
  const duration = parseInt(document.getElementById("duration").value, 10);
  const weight = parseInt(document.getElementById("weight").value, 10);
  const date = document.getElementById("date").value;

  const exerciseType = exercise === "Custom" ? customExercise : exercise;
  const caloriesBurned = calculateCalories(exerciseType, duration, weight);

  saveEntry({ exercise: exerciseType, duration, weight, date, caloriesBurned });
  trackerForm.reset();
});

// Initialize the app
loadEntries();
