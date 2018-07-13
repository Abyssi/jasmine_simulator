const fs = require('fs');
const path = require('path');

class JNSimulator {
    constructor(folder, prefix, manager, type) {
        this.manager = manager;
        this.type = type;

        fs.readdirSync(folder).forEach(file => {
            if (path.extname(file) !== ".json" || !file.startsWith(prefix))
                return;
            this.add(folder + file);
        });
    }

    add(configPath) {
        this.manager.add(new this.type(configPath));
    }

    forEach(callback) {
        this.manager.forEach(callback);
    }
}

module.exports = JNSimulator;



