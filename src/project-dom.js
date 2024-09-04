import {Project} from "./project.js";
import {editTodoItem} from "./todo-dom.js";
import {Todo} from "./todo.js";

export const defaultProject = new Project("Default");   
export let projects = [defaultProject];
export let selectedProject = defaultProject;

let numItems = selectedProject.items.length;

const saveProjects = function() {
    const projectsAsObjects = projects.map(project => project.toPlainObject());
    const projectsString = JSON.stringify(projectsAsObjects);
    localStorage.setItem("projects", projectsString);
}

const saveSelectedProject = function() {
    console.log(selectedProject);
    const selectedProjectAsObject = selectedProject.toPlainObject();
    const selectedProjectAsString = JSON.stringify(selectedProjectAsObject);
    localStorage.setItem("selected", selectedProjectAsString);
}

const retrievedSelectedProject = localStorage.getItem("selected");

if (retrievedSelectedProject) {
    const parsedSelected = JSON.parse(retrievedSelectedProject);

    if (parsedSelected.items) {
        const itemsAsClassInstances = [];
            
        for (let i = 0; i < parsedSelected.items.length; i++) {
            const objToClassInstance = Todo.fromPlainObject(
                parsedSelected.items[i]);
            itemsAsClassInstances.push(objToClassInstance);
        }

        parsedSelected.items = itemsAsClassInstances;
    }

    const selected = Project.fromPlainObject(parsedSelected.name, 
        parsedSelected.items);
    selectedProject = selected;
}



const createListElement = function(elementType, item, content, isTitle) {
    const li = document.createElement("li");
    
    if (isTitle) {
        numItems++;
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "todo" + String(numItems))

        if (item.completed) {
            checkbox.checked = true;
        }

        checkbox.addEventListener("click", () => {
            item.toggleCompletionStatus();
        });

        li.appendChild(checkbox);
    }

    const elt = document.createElement(elementType);

    if (isTitle) {
        elt.setAttribute("for", "todo" + String(numItems));
        if (item.priority) {
            elt.textContent = content + "(!)";
        } else {
            elt.textContent = content;
        }
    } else {
        elt.textContent = content;
    }

    li.appendChild(elt);
    
    return li;
}

export const displaySelectedProject = function() {
    const body = document.querySelector("body");
    const currentContainer = document.querySelector(".current-project");

    if (currentContainer) {
        body.removeChild(currentContainer);
    }

    const projContainer = document.createElement("div");
    projContainer.setAttribute("class", "current-project");
    const projNameContainer = document.createElement("h1");
    projNameContainer.textContent = selectedProject.name;
    projContainer.appendChild(projNameContainer);

    const itemList = document.createElement("ul");

    for (let i = 0; i < selectedProject.items.length; i++) {
        const itemContainer = document.createElement("div");
        const item = selectedProject.items[i];

        const label = createListElement("label", item, item.title, true, false);
        itemContainer.appendChild(label);
        if (item.expanded) {
            const description = createListElement("p", item, item.description, 
                false, false);
            itemContainer.appendChild(description);
        }
        const dueDate = createListElement("h3", item, item.dueDate, false, false);
        itemContainer.appendChild(dueDate);

        const buttonItem = document.createElement("li");
        const buttonDiv = document.createElement("div");
        const expandButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        expandButton.setAttribute("class", "item-buttons");
        deleteButton.setAttribute("class", "item-buttons");

        expandButton.textContent = "Expand Item";
        deleteButton.textContent = "Delete Item";

        expandButton.addEventListener("click", () => {
            item.toggleExpandedStatus();
            displaySelectedProject();
        });

        deleteButton.addEventListener("click", () => {
            selectedProject.removeItem(item);
            displaySelectedProject();
        });

        buttonDiv.appendChild(expandButton);
        buttonDiv.appendChild(deleteButton);
        buttonItem.appendChild(buttonDiv);
        itemContainer.appendChild(buttonItem);
        if (item.priority) {
            itemContainer.style.backgroundColor = "lightcoral";
        }
        itemList.appendChild(itemContainer);
    }

    projContainer.appendChild(itemList);
    body.insertBefore(projContainer, body.firstChild);
    saveSelectedProject();
}

export const changeSelectedProject = function() {
    const selectButtons = document.querySelectorAll(".select");

    selectButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const projName = btn.id;

            for (let i = 0; i < projects.length; i++) {
                if (projects[i].name === projName) {
                    selectedProject = projects[i];
                    displaySelectedProject();
                    break;
                }
            }2
        });
    });
}

export const displayProjects = function() {
    const container = document.querySelector(".my-projects");
    const ul = document.querySelector(".my-projects ul");

    if (ul) {
        container.removeChild(ul);
    }
    
    const listContainer = document.createElement("ul");

    for (let i = 0; i < projects.length; i++) {
        const proj = document.createElement("li");
        const textDiv = document.createElement("div");
        textDiv.textContent = projects[i].name;
        proj.appendChild(textDiv);
        const selectButton = document.createElement("button");
        selectButton.setAttribute("class", "select");
        selectButton.setAttribute("id", projects[i].name);
        selectButton.textContent = "Select";
        proj.appendChild(selectButton);
        listContainer.appendChild(proj);
    }

    container.appendChild(listContainer);
    changeSelectedProject();
    saveProjects();
}

const checkDuplicates = function(listOfProjects, name) {
    for (let i = 0; i < listOfProjects.length; i++) {
        if (listOfProjects[i].name.toLowerCase() === name.toLowerCase()) {
            return true;
        }
    }

    return false;
}

export const createProject = function() {
    const newProjButton = document.querySelector(".create-project");
    const form = document.querySelector(".proj-dialog");
    const submitButton = document.querySelector(".submit-proj");
    const cancelButton = document.querySelector(".cancel-proj");

    newProjButton.addEventListener("click", () => {
        form.showModal();
    });

    submitButton.addEventListener("click", () => {
        const nameField = document.querySelector("#name");
        const name = nameField.value;

        if (name === "") {
            alert("Please enter a name for your project!");
        } else if (checkDuplicates(projects, name)) {
            alert("Please enter a unique name for your project!");
        } else {
            const newProject = new Project(name);
            projects.push(newProject);
            nameField.value = "";
            form.close();
            displayProjects();
        }
    });

    cancelButton.addEventListener("click", () => {
        const nameField = document.querySelector("#name");
        nameField.value = "";
        form.close();
    });
}