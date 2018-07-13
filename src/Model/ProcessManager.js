class ProcessManager {
    constructor() {
        require('../Utils/MethodBinder.js').bindMethods(this, ['remove']);

        this.children = [];

        var self = this;

        function exitHandler(options, err) {
            if (options.cleanup) {
                self.children.forEach(function (child) {
                    self.remove(child);
                });
            }
            if (err && err.stack) console.log(err.stack);
            if (options.exit) process.exit();
        }

        process.on('exit', exitHandler.bind(null, {cleanup: true}));
        process.on('SIGINT', exitHandler.bind(null, {exit: true}));
        process.on('SIGUSR1', exitHandler.bind(null, {exit: true}));
        process.on('SIGUSR2', exitHandler.bind(null, {exit: true}));
        process.on('uncaughtException', exitHandler.bind(null, {exit: true}));
    }

    forEach(callback) {
        this.children.forEach(callback);
    }

    add(child) {
        this.children.push(child);
        child.onOutput(function (message) {
            console.log("[Process STDOUT] " + message);
        })
    }

    remove(child) {
        child.exit();
        this.children.splice(this.children.indexOf(child), 1);
    }
}

module.exports = ProcessManager;



