import {Project} from "./project.js";

export const defaultProject = new Project("Default");   
export const projects = [defaultProject];

export const displayProjects = function() {
    console.log(projects);
    const container = document.querySelector(".my-projects");
    const ul = document.querySelector("ul");

    if (ul) {
        container.removeChild(ul);
    }
    
    const listContainer = document.createElement("ul");

    for (let i = 0; i < projects.length; i++) {
        const proj = document.createElement("li");
        proj.textContent = projects[i].name;
        listContainer.appendChild(proj);
    }

    container.appendChild(listContainer);
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