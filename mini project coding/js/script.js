// Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');
const filterSelect = document.getElementById('filter-select');

// Event Listeners
document.addEventListener('DOMContentLoaded', loadTodos);
todoForm.addEventListener('submit', addTodo);
filterSelect.addEventListener('change', filterTodos);

default function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach(renderTodo);
}

function addTodo(e) {
  e.preventDefault();
  const task = todoInput.value.trim();
  const date = dateInput.value;
  if (!task || !date) return; // validasi input

  const todoObj = { id: Date.now(), task, date, completed: false };
  saveTodoToLocal(todoObj);
  renderTodo(todoObj);

  todoForm.reset();
}

function renderTodo(todo) {
  const item = document.createElement('li');
  item.classList.add('todo-item');
  if (todo.completed) item.classList.add('completed');
  item.dataset.id = todo.id;

  item.innerHTML = `
    <span>${todo.task} (${todo.date})</span>
    <div>
      <button class="complete-btn">✔️</button>
      <button class="delete-btn">🗑️</button>
    </div>
  `;
  todoList.appendChild(item);

  // buttons
  item.querySelector('.complete-btn').addEventListener('click', toggleComplete);
  item.querySelector('.delete-btn').addEventListener('click', deleteTodo);
}

function saveTodoToLocal(todo) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function toggleComplete(e) {
  const item = e.target.closest('li');
  item.classList.toggle('completed');
  const id = Number(item.dataset.id);
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  localStorage.setItem('todos', JSON.stringify(updated));
}

function deleteTodo(e) {
  const item = e.target.closest('li');
  const id = Number(item.dataset.id);
  item.remove();
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const filtered = todos.filter(t => t.id !== id);
  localStorage.setItem('todos', JSON.stringify(filtered));
}

function filterTodos() {
  const filter = filterSelect.value;
  const items = document.querySelectorAll('.todo-item');
  items.forEach(item => {
    switch (filter) {
      case 'completed':
        item.style.display = item.classList.contains('completed') ? 'flex' : 'none';
        break;
      case 'uncompleted':
        item.style.display = !item.classList.contains('completed') ? 'flex' : 'none';
        break;
      default:
        item.style.display = 'flex';
    }
  });
}