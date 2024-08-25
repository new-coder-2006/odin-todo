import "./styles.css";
import { displayProjects, createProject, displaySelectedProject, 
    changeSelectedProject } from "./project-dom.js";
import { addTodoItem } from "./todo-dom.js";

createProject();
addTodoItem();
displayProjects();
displaySelectedProject();
changeSelectedProject();