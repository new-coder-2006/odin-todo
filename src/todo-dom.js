import { Project } from "./project.js";
import { defaultProject, projects, displayProjects, selectedProject, displaySelectedProject } from "./project-dom.js";
import { Todo } from "./todo.js";

export const addTodoItem = function() {
    const newItemButton = document.querySelector(".add-item");
    const form = document.querySelector(".item-dialog");
    const submitButton = document.querySelector(".submit-item");
    const cancelButton = document.querySelector(".cancel-item");

    newItemButton.addEventListener("click", () => {
        form.showModal();
    });

    submitButton.addEventListener("click", () => {
        const titleField = document.querySelector("#title");
        const title = titleField.value;
        const descriptionField = document.querySelector("#description");
        const description = descriptionField.value;
        const dateField = document.querySelector("#date");
        const dueDate = dateField.value;
        const priorityField = document.querySelector("#high-priority");
        const priority = priorityField.checked;

        if (title === "") {
            alert("Please enter a title for this list item!");
        } else {
            const newItem = new Todo(title, description, dueDate, priority);
            selectedProject.addItem(newItem);
            titleField.value = "";
            descriptionField.value = "";
            dateField.value = "";
            priorityField.checked = false;
            form.close();
            displayProjects();
            displaySelectedProject();
        }
    });

    cancelButton.addEventListener("click", () => {
        const nameField = document.querySelector("#name");
        nameField.value = "";
        form.close();
    });
}