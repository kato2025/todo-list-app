//Import the ProjectList and Todo classes
import { ProjectList, Todo } from './project';
//Create project variables
const projectList = new ProjectList();
const projectInput = document.getElementById('project-name');
const addProjectButton = document.getElementById('add-project');
const projectsList = document.getElementById('projects');
const projectSelect = document.getElementById('project-select');
//Create todo variables
const todoForm = document.getElementById('todo-form');
const todoTitleInput = document.getElementById('todo-title');
const todoDescriptionInput = document.getElementById('todo-description');
const todoStartDateInput = document.getElementById('todo-start-date');
const todoEndDateInput = document.getElementById('todo-end-date');
const todoPriorityInput = document.getElementById('todo-priority');
const todoNotesInput = document.getElementById('todo-notes');
const addTodoButton = document.getElementById('add-todo');
const toggleTodoFormButton = document.getElementById('toggle-todo-form');
const todosList = document.getElementById('todos');
//Create a boolean variable to keep track of whether the todo form is visible
let isTodoFormVisible = false;
//Function to toggle the visibility of the todo form
function toggleTodoFormVisibility() {
  isTodoFormVisible = !isTodoFormVisible;
  const displayStyle = isTodoFormVisible ? 'block' : 'none';
  todoForm.style.display = displayStyle;
  toggleTodoFormButton.textContent = isTodoFormVisible ? 'Stop Adding' : 'Add Todos';
}
//Event listener to the toggleTodoFormButton
toggleTodoFormButton.addEventListener('click', toggleTodoFormVisibility);
// Function to save the project list to localStorage
function saveProjectsToLocalStorage() {
    console.log('Saving projects to localStorage');
    localStorage.setItem('projects', JSON.stringify(projectList.projects));
  }
// Function to save the project list to localStorage
function loadProjectsFromLocalStorage() {
  // Use try-catch to handle potential errors
  try {
    const savedProjects = JSON.parse(localStorage.getItem('projects'));

    if (savedProjects) {
      projectList.projects = savedProjects;
    }
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
  }
}
// Function to save the projects and todos to localStorage
function saveDataToLocalStorage() {
    saveProjectsToLocalStorage();
  } 
//Function to render the projects
function renderProjects() {
  projectsList.innerHTML = '';
  projectSelect.innerHTML = '<option value="" disabled selected>Select a Project</option>';
  projectList.projects.forEach((project) => {  // Loop through the projects
    const listItem = document.createElement('li');
    listItem.textContent = project.title;
    listItem.addEventListener('click', () => {
      renderTodos(project.title);
      highlightSelectedProject(listItem);
    });
    const editButton = document.createElement('button'); // Create an edit button
    editButton.textContent = '✏️';
    editButton.addEventListener('click', () => {
      editProject(project);
    });
    const deleteButton = document.createElement('button'); // Create a delete button
    deleteButton.textContent = '🛢';
    deleteButton.addEventListener('click', () => {
      deleteProject(project);
    });
    // Create a div element to group the editButton and deleteButton
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    // Append the listItem to the projectsList
    projectsList.appendChild(listItem); 
    // Create an option element for the project
    const projectOption = document.createElement('option');
    projectOption.value = project.title;
    projectOption.textContent = project.title;
    projectSelect.appendChild(projectOption);
  });
    // After rendering, save the data to localStorage
    saveDataToLocalStorage();
}
//Function to render the todos
function renderTodos(projectTitle) {
  todosList.innerHTML = '';
  const selectedProject = projectList.getProjectByTitle(projectTitle);
  // Check if the selectedProject exists
  if (selectedProject) {
    selectedProject.todos.forEach((todo) => {
      const todoItem = document.createElement('div');
      todoItem.classList.add('todo-item');
      todoItem.innerHTML = `
        <h3>${todo.title}</h3>
        <p>Description: ${todo.description}</p>
        <p>Start Date: ${todo.startDate}</p>
        <p>End Date: ${todo.endDate}</p>
        <p>Priority: ${todo.priority}</p>
        <p>Notes: ${todo.notes}</p>
      `;
      function getRandomColor() {
        const colors = ['#006400', '#8B0000', '#000000', '#00008B'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
      }
      // Function to get the contrast color
      function getContrastColor(hexColor) {
        // Convert the hex color to RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        // Calculate the relative luminance
        const relativeLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
        // Determine the text color based on luminance
        return relativeLuminance > 128 ? '#000000' : '#FFFFFF';
      }
      // Set the background color, text color, padding, margin, boxShadow, border and border radius
      todoItem.style.backgroundColor = getRandomColor();
      todoItem.style.color = getContrastColor(todoItem.style.backgroundColor);
      todoItem.style.borderRadius = '10px';
      todoItem.style.padding = '20px';
      todoItem.style.margin = '10px';
      todoItem.style.border = '1px solid black';
      todoItem.style.boxShadow = '5px 5px 5px #28a745';
      // Create an edit button
      const editButton = document.createElement('button');
      editButton.textContent = '✏️';
      editButton.addEventListener('click', () => {
        editTodo(selectedProject, todo);
        todoForm.style.display = 'none';
      });
      // Create a delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '🛢';
      deleteButton.addEventListener('click', () => {
        deleteTodo(selectedProject, todo);
      });
      // Create a div element to group the editButton and deleteButton
      const editButtonsDiv = document.createElement('div');
      editButtonsDiv.className = 'editTodos'; // Set the class name
      // Append the buttons to the div
      editButtonsDiv.appendChild(editButton);
      editButtonsDiv.appendChild(deleteButton);
      // Append the div containing the buttons to the todoItem
      todoItem.appendChild(editButtonsDiv);
      // Append the todoItem to the todosList
      todosList.appendChild(todoItem);
    });
  }
    // After rendering, save the data to localStorage
    saveDataToLocalStorage();
}
// Function to highlight the selected project
function highlightSelectedProject(selectedItem) {
  const projectItems = projectsList.querySelectorAll('li');
  projectItems.forEach((item) => {
    item.classList.remove('selected');
  });
  selectedItem.classList.add('selected');
}
// Function to edit a project
function editProject(project) {
  const projectTitleInput = document.createElement('input');
  projectTitleInput.type = 'text';
  projectTitleInput.value = project.title;
  // Create an update button
  const updateButton = document.createElement('button');
  updateButton.textContent = '💾';
  updateButton.addEventListener('click', () => {
    updateProject(project, projectTitleInput.value);
  });
  // Create a cancel button
  const cancelEditButton = document.createElement('button');
  cancelEditButton.textContent = '❎';
  cancelEditButton.addEventListener('click', () => {
    renderProjects();
  });
  // Add the input and buttons to the projectsList
  projectsList.innerHTML = '';
  projectsList.appendChild(projectTitleInput);
  projectsList.appendChild(updateButton);
  projectsList.appendChild(cancelEditButton);
}
// Function to update a project
function updateProject(project, newTitle) {
  project.title = newTitle;
  renderProjects();
}
// Function to delete a project
function deleteProject(project) {
  const confirmDelete = confirm(`Delete project "${project.title}"?`);
  if (confirmDelete) {
    projectList.deleteProjectByTitle(project.title);
    renderProjects();
    todosList.innerHTML = '';
  }
}
// Function to delete a todo
function deleteTodo(project, todo) {
  const confirmDelete = confirm(`Delete todo "${todo.title}"?`);
  if (confirmDelete) {
    project.deleteTodoByTitle(todo.title);
    renderTodos(project.title);
  }
}
// Function to edit a todo
function editTodo(project, todo) {
  // Create the updateTodoContainer div
  const updateTodoContainer = document.createElement('div');
  updateTodoContainer.classList.add('update-todo');
  const todoTitleLabel = document.createElement('label');
  todoTitleLabel.textContent = 'Title:';
  const todoTitleInput = document.createElement('input');
  todoTitleInput.type = 'text';
  todoTitleInput.value = todo.title;
  const todoDescriptionLabel = document.createElement('label');
  todoDescriptionLabel.textContent = 'Description:';
  const todoDescriptionInput = document.createElement('input');
  todoDescriptionInput.type = 'text';
  todoDescriptionInput.value = todo.description;
  const todoStartDateLabel = document.createElement('label');
  todoStartDateLabel.textContent = 'Start date:';
  const todoStartDateInput = document.createElement('input');
  todoStartDateInput.type = 'date';
  todoStartDateInput.value = todo.startDate;
  const todoEndDateLabel = document.createElement('label');
  todoEndDateLabel.textContent = 'End date:';
  const todoEndDateInput = document.createElement('input');
  todoEndDateInput.type = 'date';
  todoEndDateInput.value = todo.endDate;
  const todoPriorityLabel = document.createElement('label');
  todoPriorityLabel.textContent = 'Priority:';
  const todoPriorityInput = document.createElement('select');
  todoPriorityInput.innerHTML = `
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  `;
  todoPriorityInput.value = todo.priority;
  const todoNotesLabel = document.createElement('label');
  todoNotesLabel.textContent = 'Notes:';
  const todoNotesInput = document.createElement('input');
  todoNotesInput.type = 'text';
  todoNotesInput.value = todo.notes;
  // Create the update and cancel buttonGroup div
  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('updateTodo'); // Add the "updateTodo" class
   // Create an update button
  const updateButton = document.createElement('button');
  updateButton.textContent = '💾';
  updateButton.classList.add('update'); // Add the "update" class
  updateButton.addEventListener('click', () => {
    updateTodo(project, todo, {
      title: todoTitleInput.value,
      description: todoDescriptionInput.value,
      startDate: todoStartDateInput.value,
      endDate: todoEndDateInput.value,
      priority: todoPriorityInput.value,
      notes: todoNotesInput.value,
    });
  });
  // Create a cancel button
  const cancelEditButton = document.createElement('button');
  cancelEditButton.textContent = '❎';
  cancelEditButton.classList.add('cancel'); // Add the "cancel" class
  cancelEditButton.addEventListener('click', () => {
    renderTodos(project.title);
  });
  // Append labels, inputs, and <br> elements to the updateTodoContainer div
  updateTodoContainer.appendChild(todoTitleLabel);
  updateTodoContainer.appendChild(todoTitleInput);
  updateTodoContainer.appendChild(document.createElement('br'));
  updateTodoContainer.appendChild(todoDescriptionLabel);
  updateTodoContainer.appendChild(todoDescriptionInput);
  updateTodoContainer.appendChild(document.createElement('br'));
  updateTodoContainer.appendChild(todoStartDateLabel);
  updateTodoContainer.appendChild(todoStartDateInput);
  updateTodoContainer.appendChild(document.createElement('br'));
  updateTodoContainer.appendChild(todoEndDateLabel);
  updateTodoContainer.appendChild(todoEndDateInput);
  updateTodoContainer.appendChild(document.createElement('br'));
  updateTodoContainer.appendChild(todoPriorityLabel);
  updateTodoContainer.appendChild(todoPriorityInput);
  updateTodoContainer.appendChild(document.createElement('br'));
  updateTodoContainer.appendChild(todoNotesLabel);
  updateTodoContainer.appendChild(todoNotesInput);
  updateTodoContainer.appendChild(document.createElement('br'));
  // Append the update and cancel buttons to the buttonGroup div
  buttonGroup.appendChild(updateButton);
  buttonGroup.appendChild(cancelEditButton);
  // Append the buttonGroup div to the updateTodoContainer
  updateTodoContainer.appendChild(buttonGroup);
  // Replace the content of the todosList with the updateTodoContainer
  todosList.innerHTML = '';
  todosList.appendChild(updateTodoContainer);
}
// Function to update a todo
function updateTodo(project, todo, updatedData) {
  todo.title = updatedData.title;
  todo.description = updatedData.description;
  todo.startDate = updatedData.startDate;
  todo.endDate = updatedData.endDate;
  todo.priority = updatedData.priority;
  todo.notes = updatedData.notes;
  // Render the todos
  renderTodos(project.title);
}
// Event listener for adding a project using the Enter key
projectInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addProject();
  }
});
// Event listener for adding a todo to a specific project using the Enter key
todoForm.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTodo();
  }
});
// Event listener for the addProject button
addProjectButton.addEventListener('click', () => {
  addProject();
});
// Event listener for the addTodo button
addTodoButton.addEventListener('click', () => {
  addTodo();
});
// Add projects
function addProject() {
  const projectName = projectInput.value.trim();
  if (projectName) {
    projectList.createProject(projectName);
    projectInput.value = '';
    renderProjects();

    // After adding a new project, save the updated data to localStorage.
    saveDataToLocalStorage(); // Call the function to save data
  }
}
// Add todos
function addTodo() {
  const todoTitle = todoTitleInput.value.trim();
  const todoDescription = todoDescriptionInput.value.trim();
  const todoStartDate = todoStartDateInput.value;
  const todoEndDate = todoEndDateInput.value;
  const todoPriority = todoPriorityInput.value;
  const todoNotes = todoNotesInput.value.trim();
  const projectTitle = projectSelect.value;
  // Check if the todoTitle and projectTitle are not empty
  if (todoTitle && projectTitle) {
    const selectedProject = projectList.getProjectByTitle(projectTitle);
    if (selectedProject) {
      const newTodo = new Todo(
        todoTitle,
        todoDescription,
        todoStartDate,
        todoEndDate,
        todoPriority,
        todoNotes
      );
      selectedProject.addTodo(newTodo);
      todoTitleInput.value = '';
      todoDescriptionInput.value = '';
      todoStartDateInput.value = '';
      todoEndDateInput.value = '';
      todoPriorityInput.value = 'High';
      todoNotesInput.value = '';
      renderTodos(projectTitle);

      // After adding a new todo, save the updated data to localStorage
      saveDataToLocalStorage(); // Call the function to save data
    }
  }
}
// Event listener for adding a project using the Enter key
projectInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent page refresh
    addProject();
  }
});
// Event listener for adding a todo to a specific project using the Enter key
todoForm.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent page refresh
    addTodo();
  }
});
// Initialize the app
loadProjectsFromLocalStorage();
// Render the projects
renderProjects();

