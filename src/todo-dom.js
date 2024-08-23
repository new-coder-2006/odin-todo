import { Project } from "./project.js";
import { defaultProject } from "./project-dom.js";

const createTextElement = function(elementType, content, parent) {
    const elt = document.createElement(elementType);
    elt.textContent = content;
    parent.appendChild(elt);
}

export const selectedProject = defaultProject;

export const displaySelectedProject = function() {
    const currentContainer = document.querySelector(".current-project");
    const projNameContainer = document.createElement("h1");
    projNameContainer.textContent = selectedProject.name;
    currentContainer.appendChild(projNameContainer);

    const itemList = document.createElement("ul");

    for (let i = 0; i < defaultProject.items.length; i++) {
        const item = defaultProject.items[i];
        const itemContainer = document.createElement("li");

        createTextElement("h2", item.title, itemContainer);
        createTextElement("p", item.description, itemContainer);
        createTextElement("h3", item.dueDate, itemContainer);
        createTextElement("h3", item.priority, itemContainer);

        itemList.appendChild(itemContainer);
    }

    currentContainer.appendChild(itemList);
}

export const changeSelectedProject = function() {
    
}