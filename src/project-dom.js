import {Project} from "./project.js";
import {Todo} from "./todo.js";
// Create an initial default project when the user first begins using the app
export const defaultProject = new Project("Default");   
// Store all of the projects the user has created
export let projects = [defaultProject];
// Store the project whose todo list is currently being displayed
export let selectedProject = defaultProject;
// Global variable used in the creation of id's for the titles/checkboxes of 
// todo list items
let numItems = selectedProject.items.length;
/**
 * Function to save the user's projects in localStorage so that they are 
 * maintained across multiple sessions.
 */
const saveProjects = function() {
    const projectsAsObjects = projects.map(project => project.toPlainObject());
    const projectsString = JSON.stringify(projectsAsObjects);
    localStorage.setItem("projects", projectsString);
}
/**
 * Function to save the project that the user has selected as the one they are
 * currently viewing, so that the project remains selected across multiple sessions.
 */
const saveSelectedProject = function() {
    const selectedProjectAsObject = selectedProject.toPlainObject();
    const selectedProjectAsString = JSON.stringify(selectedProjectAsObject);
    localStorage.setItem("selected", selectedProjectAsString);
}

const retrievedSelectedProject = localStorage.getItem("selected");
// If a selected project has been saved, parse and render it
if (retrievedSelectedProject) {
    const parsedSelected = JSON.parse(retrievedSelectedProject);
    // Parse and render any todo list items of the saved project
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

const retrievedProjects = localStorage.getItem("projects");
// Parse and render the user's saved projects
if (retrievedProjects) {
    const parsedProjects = JSON.parse(retrievedProjects);
    // Parse and render the items of each saved project
    for (let i = 0; i < parsedProjects.length; i++) {
        if (parsedProjects[i].items) {
            const itemsAsClassInstances = [];
            
            for (let j = 0; j < parsedProjects[i].items.length; j++) {
                const objToClassInstance = Todo.fromPlainObject(
                    parsedProjects[i].items[j]);
                itemsAsClassInstances.push(objToClassInstance);
            }

            parsedProjects[i].items = itemsAsClassInstances;
        }
    }
    // Convert each plain object back to a class instance
    const projectsArray = parsedProjects.map(obj => Project.fromPlainObject(
        obj.name, obj.items));
    projects = projectsArray;
}
/**
 * Create a list element of the specified type with the provided text content.
 * Used to assist with rendering Todo list items.
 * @param {string} elementType 
 * @param {Todo} item 
 * @param {string} content 
 * @param {boolean} isTitle 
 * @returns the created list item
 */
const createListElement = function(elementType, item, content, isTitle) {
    const li = document.createElement("li");
    // If this element is the item's title, add a checkbox so the user can
    // indicate whether the item has been completed.
    if (isTitle) {
        numItems++;
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "todo" + String(numItems))
        // Render a check in the checkbox if the item's completed status is true
        if (item.completed) {
            checkbox.checked = true;
        }

        checkbox.addEventListener("click", () => {
            item.toggleCompletionStatus();
            saveProjects();
            saveSelectedProject();
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
/**
 * Function to display the title and todo list of the user's currently selected
 * project.
 */
export const displaySelectedProject = function() {
    const body = document.querySelector("body");
    const currentContainer = document.querySelector(".current-project");
    // If there is a previously displayed project (which there always should be),
    // remove it so it can be replaced with the currently selected project
    if (currentContainer) {
        body.removeChild(currentContainer);
    }
    // Display the name of the selected project
    const projContainer = document.createElement("div");
    projContainer.setAttribute("class", "current-project");
    const projNameContainer = document.createElement("h1");
    projNameContainer.textContent = selectedProject.name;
    projContainer.appendChild(projNameContainer);

    const itemList = document.createElement("ul");
    // Display all the items of the selected project
    for (let i = 0; i < selectedProject.items.length; i++) {
        const itemContainer = document.createElement("div");
        const item = selectedProject.items[i];
        // Create element for the name of the item
        const label = createListElement("label", item, item.title, true, false);
        itemContainer.appendChild(label);
        // Only print the item's notes/description if the item is in an expanded
        // state
        if (item.expanded) {
            const description = createListElement("p", item, item.description, 
                false, false);
            itemContainer.appendChild(description);
        }
        const dueDate = createListElement("h3", item, item.dueDate, false, false);
        itemContainer.appendChild(dueDate);
        // Handle creation of buttons to expand and delete items outside of 
        // createListElement so that event listeners can be added to them
        const buttonItem = document.createElement("li");
        // Store both buttons in a single div to more easily display them side
        // by side
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
            // Make sure to save the project in its expanded/unexpanded state
            // so that it will carry across multiple sessions
            saveProjects();
            saveSelectedProject();
        });

        deleteButton.addEventListener("click", () => {
            selectedProject.removeItem(item);
            displaySelectedProject();
            saveProjects();
            saveSelectedProject();
        });

        buttonDiv.appendChild(expandButton);
        buttonDiv.appendChild(deleteButton);
        buttonItem.appendChild(buttonDiv);
        itemContainer.appendChild(buttonItem);
        // Set background color of high-priority items to be light red
        if (item.priority) {
            itemContainer.style.backgroundColor = "lightcoral";
        }
        itemList.appendChild(itemContainer);
    }

    projContainer.appendChild(itemList);
    // Ensure the container for the selected project is always the first HTML
    // element so that it doesn't get repositioned when a new element is 
    // selected
    body.insertBefore(projContainer, body.firstChild);
    saveSelectedProject();
}
/**
 * 
 */
export const createSelectButtons = function() {
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
            }
        });
    });
}

export const deleteProject = function() {
    const deleteButtons = document.querySelectorAll(".delete");

    deleteButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if (projects.length < 2) {
                alert("Unable to delete this project; at least one project\
                     must be active");
            } else {
                const projName = btn.id;

                projects = projects.filter(project => project.name !== projName);
                selectedProject = projects[0];
                displayProjects();
                displaySelectedProject();
                saveProjects();
                saveSelectedProject();
            }
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
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "delete");
        deleteButton.setAttribute("id", projects[i].name);
        deleteButton.textContent = "Delete";
        proj.appendChild(deleteButton);
        listContainer.appendChild(proj);
    }

    container.appendChild(listContainer);
    createSelectButtons();
    deleteProject();
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