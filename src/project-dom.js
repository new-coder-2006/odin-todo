import {Project} from "./project.js";

export const defaultProject = new Project("Default");   
export const projects = [defaultProject];
export let selectedProject = defaultProject;

const createTextElement = function(elementType, content, parent) {
    const elt = document.createElement(elementType);
    elt.textContent = content;
    parent.appendChild(elt);
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

    for (let i = 0; i < defaultProject.items.length; i++) {
        const item = defaultProject.items[i];
        const itemContainer = document.createElement("li");

        createTextElement("h2", item.title, itemContainer);
        createTextElement("p", item.description, itemContainer);
        createTextElement("h3", item.dueDate, itemContainer);
        createTextElement("h3", item.priority, itemContainer);

        itemList.appendChild(itemContainer);
    }

    projContainer.appendChild(itemList);
    body.insertBefore(projContainer, body.firstChild);
}

export const changeSelectedProject = function() {
    const selectButtons = document.querySelectorAll(".select");

    selectButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const projName = btn.id;

            for (let i = 0; i < projects.length; i++) {
                if (projects[i].name === projName) {
                    console.log("here");
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
        proj.textContent = projects[i].name;
        const selectButton = document.createElement("button");
        selectButton.setAttribute("class", "select");
        selectButton.setAttribute("id", projects[i].name);
        selectButton.textContent = "Select";
        proj.appendChild(selectButton);
        listContainer.appendChild(proj);
    }

    container.appendChild(listContainer);
    changeSelectedProject();
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
    const submitButton = document.querySelector(".submit");
    const cancelButton = document.querySelector(".cancel");

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
            console.log(projects);
            displayProjects();
        }
    });

    cancelButton.addEventListener("click", () => {
        const nameField = document.querySelector("#name");
        nameField.value = "";
        form.close();
    });
}