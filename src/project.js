// Update the Todo and Project classes to have toJSON methods
export class Todo {
  constructor(title, description, startDate, dueDate, priority, notes) {
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
  }

  // Add a toJSON method to convert Todo to a plain object
  toJSON() {
    return {
      title: this.title,
      description: this.description,
      startDate: this.startDate,
      dueDate: this.dueDate,
      priority: this.priority,
      notes: this.notes,
    };
  }
}

export class Project {
  constructor(title) {
    this.title = title;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  deleteTodoByTitle(title) {
    this.todos = this.todos.filter((todo) => todo.title !== title);
  }

  getTodoByTitle(title) {
    return this.todos.find((todo) => todo.title === title);
  }

  // Add a toJSON method to convert Project to a plain object
  toJSON() {
    return {
      title: this.title,
      todos: this.todos.map((todo) => todo.toJSON()), // Convert todos to plain objects
    };
  }
}

export class ProjectList {
  constructor() {
    this.projects = [];
  }

  createProject(title) {
    const project = new Project(title);
    this.projects.push(project);
  }

  getProjectByTitle(title) {
    return this.projects.find((project) => project.title === title);
  }

  deleteProjectByTitle(title) {
    this.projects = this.projects.filter((project) => project.title !== title);
  }

  // Add a toJSON method to convert ProjectList to a plain object
  toJSON() {
    return {
      projects: this.projects.map((project) => project.toJSON()), // Convert projects to plain objects
    };
  }
}
