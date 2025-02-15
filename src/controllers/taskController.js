// In-memory storage for tasks
let tasks = [];

// Get all tasks
exports.getTasks = (req, res) => {
  res.json(tasks);
};

// Get a single task
exports.getTask = (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
};

// Create a new task
exports.createTask = (req, res) => {
  const task = {
    id: tasks.length + 1,
    title: req.body.title,
    description: req.body.description,
    completed: false,
    createdAt: new Date()
  };

  tasks.push(task);
  res.status(201).json(task);
};

// Update a task
exports.updateTask = (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.completed = req.body.completed ?? task.completed;

  res.json(task);
};

// Delete a task
exports.deleteTask = (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
}; 