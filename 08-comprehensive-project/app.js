// 待辦事項應用 - 基礎版本
// 這個檔案故意保持簡單，讓 Agent 有空間添加新功能

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.isDarkMode = false;
        this.init();
    }

    init() {
        // 從 LocalStorage 載入資料
        this.loadTodos();
        
        // 綁定事件
        this.bindEvents();
        
        // 初始渲染
        this.render();

        // 初始化 dark mode 狀態
        this.initDarkMode();
    }

    bindEvents() {
        // 新增任務
        document.getElementById('addTodo').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // 過濾器
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Dark mode 切換按鈕
        const darkModeBtn = document.getElementById('toggleDarkMode');
        if (darkModeBtn) {
          darkModeBtn.addEventListener('click', () => this.toggleDarkMode());
        }
    }
        /**
         * 初始化 dark mode 狀態，根據 localStorage 或系統偏好設定
         */
        initDarkMode() {
            const saved = localStorage.getItem('darkMode');
            if (saved === 'true') {
                this.isDarkMode = true;
                document.body.classList.add('dark-mode');
            } else if (saved === 'false') {
                this.isDarkMode = false;
                document.body.classList.remove('dark-mode');
            } else {
                // 根據系統偏好
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    this.isDarkMode = true;
                    document.body.classList.add('dark-mode');
                }
            }
            this.updateDarkModeBtn();
        }

        /**
         * 切換 dark mode 狀態
         */
        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
            if (this.isDarkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            localStorage.setItem('darkMode', this.isDarkMode);
            this.updateDarkModeBtn();
        }

        /**
         * 更新 dark mode 切換按鈕文字
         */
        updateDarkModeBtn() {
            const btn = document.getElementById('toggleDarkMode');
            if (btn) {
                btn.textContent = this.isDarkMode ? '☀️ 淺色模式' : '🌙 深色模式';
            }
        }

    addTodo() {
        const input = document.getElementById('todoInput');
        const deadlineInput = document.getElementById('deadlineInput');
        const text = input.value.trim();
        const deadline = deadlineInput.value;
        if (!text) return;
        const todo = {
            id: Date.now(),
            text: text,
            deadline: deadline || '',
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.todos.push(todo);
        this.saveTodos();
        this.render();
        input.value = '';
        deadlineInput.value = '';
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // 更新按鈕狀態
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('completionRate').textContent = `${rate}%`;
    }

    render() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();
        if (filteredTodos.length === 0) {
            todoList.innerHTML = '<li class="empty-state">沒有任務</li>';
        } else {
            todoList.innerHTML = filteredTodos.map(todo => `
                <li class="todo-item ${todo.completed ? 'completed' : ''}">
                    <input type="checkbox" 
                           class="todo-checkbox" 
                           ${todo.completed ? 'checked' : ''} 
                           onchange="todoApp.toggleTodo(${todo.id})">
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <span class="todo-deadline">${todo.deadline ? 'Deadline: ' + todo.deadline : ''}</span>
                    <button class="edit-btn" onclick="todoApp.openEditModal(${todo.id})">Edit</button>
                    <button class="delete-btn" onclick="todoApp.deleteTodo(${todo.id})">刪除</button>
                </li>
            `).join('');
        }
        this.updateStats();
    }

    openEditModal(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;
        document.getElementById('editTaskName').value = todo.text;
        document.getElementById('editTaskDeadline').value = todo.deadline || '';
        document.getElementById('editModal').style.display = 'block';
        this.editingId = id;
    }

    closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingId = null;
    }

    saveEdit() {
        const id = this.editingId;
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;
        const newText = document.getElementById('editTaskName').value.trim();
        const newDeadline = document.getElementById('editTaskDeadline').value;
        if (!newText) return;
        todo.text = newText;
        todo.deadline = newDeadline;
        this.saveTodos();
        this.render();
        this.closeEditModal();
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const saved = localStorage.getItem('todos');
        if (saved) {
            try {
                this.todos = JSON.parse(saved).map(todo => ({
                    ...todo,
                    deadline: todo.deadline || ''
                }));
            } catch (e) {
                console.error('載入任務失敗:', e);
                this.todos = [];
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化應用
const todoApp = new TodoApp();
// Modal event listeners
document.getElementById('closeEditModal').onclick = () => todoApp.closeEditModal();
document.getElementById('saveEditBtn').onclick = () => todoApp.saveEdit();
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        todoApp.closeEditModal();
    }
};