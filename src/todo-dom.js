import {
  displayProjects,
  selectedProject,
  displaySelectedProject,
} from "./project-dom.js";
import { Todo } from "./todo.js";
/**
 * Helper function used by addTodoItem to check whether the proposed name of
 * an item is identical to the name of an already-existing item. Enforces the
 * invariant that no two items in a single todo list can have the same name.
 * @param {array of Items} listOfItems
 * @param {string} name
 * @returns boolean value representing whether or not an item with the specified
 * name already exists
 */
const checkDuplicates = function (listOfItems, name) {
  for (let i = 0; i < listOfItems.length; i++) {
    // Invariant is case-insensitive, meaning you can't create two projects
    // with names that have identical spellings but different capitalization
    if (listOfItems[i].title.toLowerCase() === name.toLowerCase()) {
      return true;
    }
  }

  return false;
};
/**
 * Function that allows the user to add a new todo list item to a project
 */
export const addTodoItem = function () {
  const newItemButton = document.querySelector(".add-item");
  const form = document.querySelector(".item-dialog");
  const submitButton = document.querySelector(".submit-item");
  const cancelButton = document.querySelector(".cancel-item");
  // When the button is clicked to create an item, show the user a dialog box
  // with fields for the relevant information
  newItemButton.addEventListener("click", () => {
    form.showModal();
  });

  submitButton.addEventListener("click", () => {
    const titleField = document.querySelector("#title");
    const title = titleField.value;

    const descriptionField = document.querySelector("#description");
    const description = descriptionField.value;

    const dateField = document.querySelector("#date");
    const dateValue = dateField.value;
    let dueDate;
    // If the user enters a due date, format it to mm-dd-yyyy format;
    // otherwise, display text noting that the due date is still to be
    // determined
    if (dateValue != "") {
      const [year, month, day] = dateValue.split("-");
      const formattedDate = `${month}-${day}-${year}`;
      dueDate = "Due Date: " + formattedDate;
    } else {
      dueDate = "Due Date: TBD";
    }

    const priorityField = document.querySelector("#high-priority");
    // Stores Boolean value representing whether the user ticked the box
    // to mark the item as high priority
    const priority = priorityField.checked;
    // Enforce requirement that the item must have a title (no other fields
    // are required)
    if (title === "") {
      alert("Please enter a title for this list item!");
    } else if (checkDuplicates(selectedProject.items, title)) {
      alert("Please enter a unique name for this item!");
    } else {
      const newItem = new Todo(title, description, dueDate, priority);
      // Can only add items to the project that is currently selected for
      // display
      selectedProject.addItem(newItem);
      // Reset form fields after information is submitted and close the
      // form
      titleField.value = "";
      descriptionField.value = "";
      dateField.value = "";
      priorityField.checked = false;
      form.close();
      displayProjects();
      displaySelectedProject();
    }
  });
  // Add event listener so that the user can cancel creation of a new item
  cancelButton.addEventListener("click", () => {
    const nameField = document.querySelector("#name");
    nameField.value = "";
    form.close();
  });
};
