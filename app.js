// Elements
const trackerForm = document.getElementById('tracker-form');
const entriesList = document.getElementById('entries-list');

// Load entries from localStorage
function loadEntries() {
  const entries = JSON.parse(localStorage.getItem('exerciseEntries')) || [];
  entriesList.innerHTML = '';
  entries.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${entry.date}</strong>: ${entry.exercise} for ${entry.duration} minutes
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
  const duration = document.getElementById('duration').value;
  const date = document.getElementById('date').value;

  saveEntry({ exercise, duration, date });
  trackerForm.reset();
});

// Initialize the app
loadEntries();
