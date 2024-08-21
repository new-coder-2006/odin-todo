export class Project {
    constructor(name) {
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

    removeItem(item) {
        this._items = this._items.filter(
            obj => obj.title() !== item.title() ||
                   obj.description() !== item.description() ||
                   obj.dueDate() !== item.dueDate() ||
                   obj.priority() !== item.priority()
        );
    }
}