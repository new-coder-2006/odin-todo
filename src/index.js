import "./styles.css";
import { displayProjects, createProject } from "./project-dom.js";
import { displaySelectedProject, changeSelectedProject } from "./todo-dom.js";

createProject();
displayProjects();
displaySelectedProject();
changeSelectedProject();