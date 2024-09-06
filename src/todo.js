/**
 * Class for creating todo list items. Each item has a title and description,
 * which are strings, a due date of type "date", and three boolean values 
 * representing whether or not the item is high priority, whether or not the
 * item has been marked as completed, and whether or not the item has been 
 * expanded to show the description, respectively.
 * 
 * INVARIANT: NO TWO ITEMS IN A SINGLE TODO LIST CAN HAVE THE SAME NAME (THIS IS
 * CASE INSENSITIVE).
 */
export class Todo {
    constructor(title, description, dueDate, priority, completed = false, 
        expanded = false) {
        this._title = title;
        this._description = description;
        this._dueDate = dueDate;
        this._priority = priority;
        this._completed = completed;
        this._expanded = expanded;
    }

    get title() {
        return this._title;
    }

    get description() {
        return this._description;
    }

    get dueDate() {
        return this._dueDate;
    }

    get priority() {
        return this._priority;
    }

    get completed() {
        return this._completed;
    }

    get expanded() {
        return this._expanded;
    }

    set title(newTitle) {
        this._title = newTitle;
    }

    set description(newDescription) {
        this._description = newDescription;
    }

    set dueDate(newDueDate) {
        this._dueDate = newDueDate;
    }

    set priority(newPriority) {
        this._priority = newPriority;
    }

    toggleCompletionStatus() {
        this._completed = !(this._completed);
    }

    toggleExpandedStatus() {
        this._expanded = !(this._expanded);
    }
    /**
     * 
     * @returns the todo list item in object form, so that it can be saved to
     * localStorage
     */
    toPlainObject() {
        return {
          title: this._title,
          description: this._description,
          dueDate: this._dueDate,
          priority: this._priority,
          completed: this._completed,
          expanded: this._expanded
        }
    }
    /**
     * 
     * @param {Object} obj 
     * @returns a new Todo list item from a plain object that was retrieved from
     * localStorage
     */
    static fromPlainObject(obj) {
        return new Todo(obj.title, obj.description, obj.dueDate, 
            obj.priority, obj.completed, obj.expanded);
    }
}