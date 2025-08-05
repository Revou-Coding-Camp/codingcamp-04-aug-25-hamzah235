/* js/app.js */
// DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const filterInput = document.getElementById('filter-input');
const todoList = document.getElementById('todo-list');
const addBtn = document.getElementById('add-btn');
const themeToggle = document.getElementById('theme-toggle');
const taskCount = document.getElementById('task-count');
const clearBtn = document.getElementById('clear-btn');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
  // Render existing tasks
  renderTasks(tasks);
  // Enable/disable add button based on form inputs
  toggleAddButton();
});

// Enable add button when inputs change
todoForm.addEventListener('input', toggleAddButton);

function toggleAddButton() {
  addBtn.disabled = !todoInput.value.trim() || !dateInput.value;
}

// Toggle theme
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Add task
todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const newTask = {
    id: Date.now(),
    text: todoInput.value.trim(),
    date: dateInput.value,
    completed: false
  };
  tasks.unshift(newTask);
  saveAndRender();
  todoForm.reset();
});

// Task list click events
todoList.addEventListener('click', e => {
  const listItem = e.target.closest('li');
  if (!listItem) return;
  const id = Number(listItem.dataset.id);
  if (e.target.classList.contains('delete-btn')) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
  }
  if (e.target.classList.contains('complete-btn')) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
  }
});

// Clear completed tasks
clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveAndRender();
});

// Filter tasks
toggleFilter();
filterInput.addEventListener('input', toggleFilter);

function toggleFilter() {
  const term = filterInput.value.toLowerCase();
  const filtered = tasks.filter(t => (`${t.date} - ${t.text}`).toLowerCase().includes(term));
  renderTasks(filtered);
}

// Save to localStorage and re-render
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(tasks);
}

// Render task list
function renderTasks(list) {
  todoList.innerHTML = '';
  list.forEach(t => {
    const li = document.createElement('li');
    li.className = t.completed ? 'completed enter' : 'enter';
    li.dataset.id = t.id;
    li.innerHTML = `
      <span><strong>${t.date}</strong> – ${t.text}</span>
      <div>
        <button class="icon-btn complete-btn material-icons" title="Toggle Complete">
          ${t.completed ? 'check_box' : 'check_box_outline_blank'}
        </button>
        <button class="icon-btn delete-btn material-icons" title="Delete">delete</button>
      </div>
    `;
    todoList.append(li);
  });
  taskCount.textContent = `${list.length} task${list.length !== 1 ? 's' : ''}`;
}
