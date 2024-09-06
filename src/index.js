import "./styles.css";
import { displayProjects, createProject, displaySelectedProject, 
    createSelectButtons } from "./project-dom.js";
import { addTodoItem } from "./todo-dom.js";

createProject();
addTodoItem();
displayProjects();
displaySelectedProject();
createSelectButtons();