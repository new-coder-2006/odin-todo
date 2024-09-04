import {Project} from "./project.js";

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

    static fromPlainObject(obj) {
        return new Todo(obj.title, obj.description, obj.dueDate, 
            obj.priority, obj.completed, obj.expanded);
    }
}