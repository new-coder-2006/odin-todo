export class Todo {
    constructor(title, description, dueDate, priority) {
        this._title = title;
        this._description = description;
        this._dueDate = dueDate;
        this._priority = priority;
        this._completed = false;
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
}