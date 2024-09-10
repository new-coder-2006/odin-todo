/**
 * Class for creating projects. Each project has a name, which is a string,
 * and a list of todo items (which is initially empty). Note that when a user
 * creates a project, they do not specify items up front, so each project is
 * initially created with just a name and an empty list of items, which can
 * then be filled by the user adding items.
 *
 * INVARIANT: NO TWO OF THE USER'S PROJECTS MAY HAVE THE SAME NAME (THIS IS
 * CASE INSENSITIVE).
 */
export class Project {
  constructor(name, items = []) {
    this._name = name;
    this._items = items;
  }

  get name() {
    return this._name;
  }

  get items() {
    return this._items;
  }

  set name(newName) {
    this._name = newName;
  }

  addItem(item) {
    this._items.push(item);
  }
  /**
   * Handles deletion of items from the project. Called when the delete button
   * associated with the item is clicked.
   * @param {Item} item to delete
   */
  removeItem(title) {
    this._items = this._items.filter(
      (obj) =>
        obj.title !== title 
    );
  }
  /**
   *
   * @returns Project as a plain object that can be stringified and saved to
   * localStorage
   */
  toPlainObject() {
    return {
      name: this._name,
      items: this._items.map((item) => item.toPlainObject()),
    };
  }
  /**
   * Function to create a new Project from a name and list of items that have
   * been retrieved from localStorage
   * @param {string} name
   * @param {array of Items} items
   * @returns New Project with the specified name and items
   */
  static fromPlainObject(name, items) {
    return new Project(name, items);
  }
}
