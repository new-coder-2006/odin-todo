import { Project } from "./project.js";
import { Todo } from "./todo.js";
import { setEditing } from "./todo-dom.js";
// Create an initial default project when the user first begins using the app
export const defaultProject = new Project("Default");
// Store all of the projects the user has created
// INVARIANT: ALL PROJECTS MUST HAVE UNIQUE NAMES
export let projects = [defaultProject];
// Store the project whose todo list is currently being displayed
export let selectedProject = defaultProject;
// This is used to store the current title of an item that is being edited.
// Used to ensure the alert regarding unique item titles doesn't fire when a
// user edits an item but does not change its name, and also used to remove
// the previous instantiation of an item when a user submits an edit
export let currentTitle = "";
// Global variable used in the creation of id's for the titles/checkboxes of
// todo list items
let numItems = selectedProject.items.length;
/**
 * Function to save the user's projects in localStorage so that they are
 * maintained across multiple sessions.
 */
const saveProjects = function () {
  const projectsAsObjects = projects.map((project) => project.toPlainObject());
  const projectsString = JSON.stringify(projectsAsObjects);
  localStorage.setItem("projects", projectsString);
};
/**
 * Function to save the project that the user has selected as the one they are
 * currently viewing, so that the project remains selected across multiple sessions.
 */
const saveSelectedProject = function () {
  const selectedProjectAsObject = selectedProject.toPlainObject();
  const selectedProjectAsString = JSON.stringify(selectedProjectAsObject);
  localStorage.setItem("selected", selectedProjectAsString);
};

const retrievedSelectedProject = localStorage.getItem("selected");
// If a selected project has been saved, parse and render it
if (retrievedSelectedProject) {
  const parsedSelected = JSON.parse(retrievedSelectedProject);
  // Parse and render any todo list items of the saved project
  if (parsedSelected.items) {
    const itemsAsClassInstances = [];

    for (let i = 0; i < parsedSelected.items.length; i++) {
      const objToClassInstance = Todo.fromPlainObject(parsedSelected.items[i]);
      itemsAsClassInstances.push(objToClassInstance);
    }

    parsedSelected.items = itemsAsClassInstances;
  }

  const selected = Project.fromPlainObject(
    parsedSelected.name,
    parsedSelected.items
  );
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
          parsedProjects[i].items[j]
        );
        itemsAsClassInstances.push(objToClassInstance);
      }

      parsedProjects[i].items = itemsAsClassInstances;
    }
  }
  // Convert each plain object back to a class instance
  const projectsArray = parsedProjects.map((obj) =>
    Project.fromPlainObject(obj.name, obj.items)
  );
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
const createListElement = function (elementType, item, content, isTitle) {
  const li = document.createElement("li");
  // If this element is the item's title, add a checkbox so the user can
  // indicate whether the item has been completed.
  if (isTitle) {
    numItems++;
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", "todo" + String(numItems));
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
    elt.setAttribute("id", content);

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
};
/**
 * Function to display the title and todo list of the user's currently selected
 * project.
 */
export const displaySelectedProject = function () {
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
      const description = createListElement(
        "p",
        item,
        item.description,
        false,
        false
      );
      itemContainer.appendChild(description);
    }
    const dueDate = createListElement("h3", item, item.dueDate, false, false);
    itemContainer.appendChild(dueDate);
    // Handle creation of buttons to expand, edit, and delete items outside of
    // createListElement so that event listeners can be added to them
    const buttonItem = document.createElement("li");
    // Store all three buttons in a single div to more easily display them side
    // by side
    const buttonDiv = document.createElement("div");
    const expandButton = document.createElement("button");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    expandButton.setAttribute("class", "item-buttons");
    // Use a different class name for edit buttons so they can be selected in
    // todo-dom.js
    editButton.setAttribute("class", "edit-buttons");
    deleteButton.setAttribute("class", "item-buttons");

    expandButton.textContent = "Expand Item";
    editButton.textContent = "Edit Item";
    deleteButton.textContent = "Delete Item";

    expandButton.addEventListener("click", () => {
      item.toggleExpandedStatus();
      displaySelectedProject();
      // Make sure to save the project in its expanded/unexpanded state
      // so that it will carry across multiple sessions
      saveProjects();
      saveSelectedProject();
    });

    editButton.addEventListener("click", () => {
      // Set the value of the editing variable in todo-dom.js to be true so
      // that form submission is handled appropriately
      setEditing();
      const form = document.querySelector(".item-dialog");

      const titleField = document.querySelector("#title");
      const descriptionField = document.querySelector("#description");
      const priorityField = document.querySelector("#high-priority");
      // Ensure that form fields have their existing values (but note that I
      // wasn't sure how to do this for due date and I wasn't too fussed about
      // it given that it is not too cumbersome to just set the date again, so it
      // isn't listed here)
      titleField.value = item.title;
      descriptionField.value = item.description;
      priorityField.checked = item.priority;

      currentTitle = item.title;

      form.showModal();
    });

    deleteButton.addEventListener("click", () => {
      selectedProject.removeItem(item.title);
      saveProjects();
      saveSelectedProject();
      displaySelectedProject();
    });

    buttonDiv.appendChild(expandButton);
    buttonDiv.appendChild(editButton);
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
};
/**
 * Function to add event listeners to the select button for each project, so
 * that, when clicked, the applicable project becomes the selected project
 * that the user is viewing.
 */
export const createSelectButtons = function () {
  const selectButtons = document.querySelectorAll(".select");

  selectButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // The select buttons are linked to the applicable project in the
      // project list by having the project's name set as the applicable
      // select button's id
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
};
/**
 * Function to facilitate deleting projects. Only works if the user has stored
 * more than one project. Otherwise throws an alert that a user cannot delete
 * their only project.
 */
export const deleteProject = function () {
  const deleteButtons = document.querySelectorAll(".delete");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (projects.length < 2) {
        alert(
          "Unable to delete this project; at least one project\
                     must be active"
        );
      } else {
        // Delete buttons are linked to projects in the same way as
        // select buttons described above
        const projName = btn.id;

        projects = projects.filter((project) => project.name !== projName);
        // Handle case where the project being deleted is the currently
        // selected project
        if (projName === selectedProject.name) {
          selectedProject = projects[0];
        }

        displayProjects();
        displaySelectedProject();
        saveProjects();
        saveSelectedProject();
      }
    });
  });
};
/**
 * Function to display a list of the user's projects, as well as buttons to
 * select and delete each project.
 */
export const displayProjects = function () {
  const container = document.querySelector(".my-projects");
  const ul = document.querySelector(".my-projects ul");
  // If there is already an existing list of projects (which there should be),
  // remove it so it can be replaced with the updated list of projects
  if (ul) {
    container.removeChild(ul);
  }

  const listContainer = document.createElement("ul");
  // Iterate over the list of projects and display the name, select button,
  // and delete button of each one
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
  // Make sure to add event listeners to the select and delete buttons
  createSelectButtons();
  deleteProject();
  // Save the projects to localStorage
  saveProjects();
};
/**
 * Helper function used by createProject to check whether the proposed name of
 * a project is identical to the name of an already-exisiting project. Enforces the
 * invariant that no two projects can have the same name.
 * @param {Project array} listOfProjects
 * @param {string} name
 * @returns boolean value representing whether a previously created project has
 * the same name as the specified name
 */
const checkDuplicates = function (listOfProjects, name) {
  for (let i = 0; i < listOfProjects.length; i++) {
    // Invariant is case-insensitive, meaning you can't create two projects
    // with names that have identical spellings but different capitalization
    if (listOfProjects[i].name.toLowerCase() === name.toLowerCase()) {
      return true;
    }
  }

  return false;
};
/**
 * Function that enables a user to create a new project via the use of a dialog
 * box.
 */
export const createProject = function () {
  const newProjButton = document.querySelector(".create-project");
  const form = document.querySelector(".proj-dialog");
  const submitButton = document.querySelector(".submit-proj");
  const cancelButton = document.querySelector(".cancel-proj");

  newProjButton.addEventListener("click", () => {
    form.showModal();
  });
  // Add event listener to the submit button of the dialog so that, if all
  // the required field is completed, when it is clicked a new project is
  // created and saved
  submitButton.addEventListener("click", () => {
    const nameField = document.querySelector("#name");
    const name = nameField.value;
    // Enforce requirement that project must have a name
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
  // Add event listener to cancel button so that when it is clicked, the
  // dialog box is closed and the name field is reset
  cancelButton.addEventListener("click", () => {
    const nameField = document.querySelector("#name");
    nameField.value = "";
    form.close();
  });
};
