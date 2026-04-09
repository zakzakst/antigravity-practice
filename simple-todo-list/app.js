// State
let tasks = [];
let currentFilter = 'all'; // all, active, completed

// DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
});

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update active class
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update filter state and render
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    });
});

// Functions
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return; // Ignore empty inputs

    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    renderTasks();
}

// Ensure this is exposed for inline onclick (though let's better use event delegation or window global)
window.toggleTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

window.editTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // テキスト編集用のダイアログを表示
    const newText = prompt('タスクの内容を編集してください:', task.text);
    
    // キャンセルされなかった場合、かつ空欄でない場合にテキストを更新する
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

window.deleteTask = function(id) {
    // 【追加仕様】削除確認ダイアログ
    const isConfirmed = confirm('本当にこのタスクを削除してもよろしいですか？');
    if (!isConfirmed) {
        return; // キャンセルされたら何もしない
    }

    const taskElement = document.querySelector(`[data-id="${id}"]`);
    
    // Add fade-out animation
    if(taskElement) {
        taskElement.classList.add('fade-out');
        // Wait for animation to finish before actual deletion
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }, 300);
    } else {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

function renderTasks() {
    taskList.innerHTML = '';

    // Filter tasks
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    // Render nodes
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);

        li.innerHTML = `
            <div class="task-info">
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                <span class="task-text">${escapeHTML(task.text)}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask('${task.id}')" title="編集">✎</button>
                <button class="delete-btn" onclick="deleteTask('${task.id}')" title="削除">×</button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
}

// XSS protection
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
