<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA44ToLHpJtSF-uJyO7OD0-HiVDmHnaK6s",
    authDomain: "exercisehealthtracker.firebaseapp.com",
    projectId: "exercisehealthtracker",
    storageBucket: "exercisehealthtracker.firebasestorage.app",
    messagingSenderId: "434460654537",
    appId: "1:434460654537:web:4bf833a40a27eea8b18618"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

// Save exercise entry to Firestore
async function saveEntry(entry) {
  try {
    await db.collection("entries").add(entry);
    console.log("Entry saved successfully:", entry);
    loadEntries();
  } catch (error) {
    console.error("Error saving entry:", error);
  }
}

// Load entries from Firestore
async function loadEntries() {
  try {
    const snapshot = await db.collection("entries").get();
    entriesList.innerHTML = "";
    snapshot.forEach(doc => {
      const entry = doc.data();
      const li = document.createElement("li");
      li.textContent = `${entry.date}: ${entry.exercise} for ${entry.duration} minutes (${entry.caloriesBurned} cal)`;
      entriesList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading entries:", error);
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
  const caloriesBurned = Math.round(0.0175 * duration * weight);

  saveEntry({ exercise: exerciseType, duration, weight, date, caloriesBurned });
  trackerForm.reset();
});

// Load entries on page load
loadEntries();