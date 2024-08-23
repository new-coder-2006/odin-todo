import "./styles.css";
import { displayProjects, createProject } from "./project-dom.js";
import { displaySelectedProject } from "./todo-dom.js";

createProject();
displayProjects();
displaySelectedProject();