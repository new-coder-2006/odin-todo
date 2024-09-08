import "./styles.css";
import {
  displayProjects,
  createProject,
  displaySelectedProject,
  createSelectButtons,
} from "./project-dom.js";
import { addTodoItem } from "./todo-dom.js";
// Initial calls to display the user's list of projects and currently selected
// project and add relevant event listeners
createProject();
addTodoItem();
displayProjects();
displaySelectedProject();
createSelectButtons();
