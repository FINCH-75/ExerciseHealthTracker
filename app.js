// Your web app's Firebase configuration
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


// Example: Checking Firebase connection
console.log("Firebase initialized:", firebase);


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

// Load entries from localStorage
function loadEntries() {
  const entries = JSON.parse(localStorage.getItem('exerciseEntries')) || [];
  entriesList.innerHTML = '';
  entries.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${entry.date}</strong>: ${entry.exercise} for ${entry.duration} minutes (${entry.caloriesBurned} cal)</span>
      <button data-index="${index}" class="delete-btn">Delete</button>
    `;
    entriesList.appendChild(li);
  });

  // Add delete functionality
  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      deleteEntry(index);
    });
  });
}

// Calculate calories burned
function calculateCalories(exercise, duration, weight) {
  const burnRate = calorieBurnRates[exercise] || calorieBurnRates["Custom"];
  return Math.round(burnRate * weight * duration);
}

// Save entry to localStorage
function saveEntry(entry) {
  const entries = JSON.parse(localStorage.getItem('exerciseEntries')) || [];
  entries.push(entry);
  localStorage.setItem('exerciseEntries', JSON.stringify(entries));
  loadEntries();
}

// Delete entry from localStorage
function deleteEntry(index) {
  const entries = JSON.parse(localStorage.getItem('exerciseEntries')) || [];
  entries.splice(index, 1);
  localStorage.setItem('exerciseEntries', JSON.stringify(entries));
  loadEntries();
}

// Handle form submission
trackerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const exercise = document.getElementById('exercise').value;
  const customExercise = document.getElementById('custom-exercise').value;
  const duration = document.getElementById('duration').value;
  const weight = document.getElementById('weight').value;
  const date = document.getElementById('date').value;

  const exerciseType = exercise === "Custom" ? customExercise : exercise;
  const caloriesBurned = calculateCalories(exerciseType, duration, weight);

  saveEntry({ exercise: exerciseType, duration, date, caloriesBurned });
  trackerForm.reset();
});

// Initialize the app
loadEntries();
