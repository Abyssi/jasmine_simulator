class InstanceManager {
    constructor() {
        this.children = [];
    }

    forEach(callback) {
        this.children.forEach(callback);
    }

    add(child) {
        this.children.push(child);
    }

    remove(child) {
        child.exit();
        this.children.splice(this.children.indexOf(child), 1);
    }
}

module.exports = InstanceManager;



