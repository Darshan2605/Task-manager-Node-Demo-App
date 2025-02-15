document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const tasksContainer = document.getElementById('tasksContainer');
    const addTaskForm = document.getElementById('addTaskForm');

    // Load tasks when page loads
    loadTasks();

    // Event Listeners
    addTaskBtn.addEventListener('click', () => {
        taskForm.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        taskForm.classList.add('hidden');
        addTaskForm.reset();
    });

    addTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            });

            if (response.ok) {
                const task = await response.json();
                addTaskToDOM(task);
                addTaskForm.reset();
                taskForm.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });

    async function loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            tasks.forEach(task => addTaskToDOM(task));
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    function addTaskToDOM(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-card ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.id = task.id;

        taskElement.innerHTML = `
            <div class="task-content">
                <h3 class="task-title">${task.title}</h3>
                <p class="task-description">${task.description}</p>
            </div>
            <div class="task-actions">
                <button class="btn-complete" title="Toggle Complete">
                    <i class="fas fa-check-circle"></i>
                </button>
                <button class="btn-delete" title="Delete Task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Add event listeners for complete and delete buttons
        const completeBtn = taskElement.querySelector('.btn-complete');
        const deleteBtn = taskElement.querySelector('.btn-delete');

        completeBtn.addEventListener('click', () => toggleComplete(task.id, taskElement));
        deleteBtn.addEventListener('click', () => deleteTask(task.id, taskElement));

        tasksContainer.appendChild(taskElement);
    }

    async function toggleComplete(taskId, taskElement) {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: !taskElement.classList.contains('completed')
                })
            });

            if (response.ok) {
                taskElement.classList.toggle('completed');
            }
        } catch (error) {
            console.error('Error toggling task completion:', error);
        }
    }

    async function deleteTask(taskId, taskElement) {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                taskElement.remove();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
}); 