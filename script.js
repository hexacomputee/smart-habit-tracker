// Elements
const habitInput = document.getElementById('habitInput');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitList = document.getElementById('habitList');
const scoreEl = document.getElementById('score');
const dashboardSection = document.getElementById('dashboardSection');
const habitsSection = document.getElementById('habitsSection');
const dashboardBtn = document.getElementById('dashboardBtn');
const habitsBtn = document.getElementById('habitsBtn');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Navigation
dashboardBtn.addEventListener('click', () => {
  dashboardSection.classList.remove('hidden');
  habitsSection.classList.add('hidden');
  renderChart();
});
habitsBtn.addEventListener('click', () => {
  dashboardSection.classList.add('hidden');
  habitsSection.classList.remove('hidden');
});

// Add habit
addHabitBtn.addEventListener('click', () => {
  const habit = habitInput.value.trim();
  if (habit) {
    habits.push({ name: habit, completed: false });
    habitInput.value = '';
    saveHabits();
    renderHabits();
    updateScore();
    renderChart();
  }
});

// Save to localStorage
function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

// Render habits
function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit, index) => {
    const li = document.createElement('li');
    li.className = "flex justify-between items-center bg-gray-800 p-3 rounded-md transition hover:bg-gray-700";

    li.innerHTML = `
      <span class="${habit.completed ? 'line-through text-gray-400' : ''}">${habit.name}</span>
      <button class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded" onclick="toggleComplete(${index})">
        ${habit.completed ? '✔' : '✖'}
      </button>
    `;
    habitList.appendChild(li);
  });
}

// Toggle complete + confetti
function toggleComplete(index) {
  habits[index].completed = !habits[index].completed;
  if (habits[index].completed) confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  saveHabits();
  renderHabits();
  updateScore();
  renderChart();
}

// Update productivity score
function updateScore() {
  if (habits.length === 0) {
    scoreEl.textContent = 0;
    return;
  }
  const completed = habits.filter(h => h.completed).length;
  const score = Math.round((completed / habits.length) * 100);
  scoreEl.textContent = score;
}

// Chart
let chart;
function renderChart() {
  const ctx = document.getElementById('habitChart').getContext('2d');
  const labels = habits.map(h => h.name);
  const data = habits.map(h => h.completed ? 1 : 0);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Completion',
        data: data,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 1, ticks: { stepSize: 1 } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// Initial render
renderHabits();
updateScore();
renderChart();
