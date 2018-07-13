const path = require('path');
const fork = require('child_process').fork;

class Process {
    constructor(relativePath, params) {
        const options = {stdio: ['pipe', 'pipe', 'pipe', 'ipc']};
        this.child = fork(path.resolve(relativePath), params, options);
    }

    onOutput(callback) {
        this.child.stdout.on('data', function (buf) {
            callback(String(buf));
        });
    }

    send(message) {
        this.child.send(message);
    }

    exit() {
        this.child.kill();
    }
}

class SemaphoreProcess extends Process {
    constructor(configPath) {
        const argv = [
            '--config_path=' + configPath,
            '--type=' + 'process',
            '--time=' + 1000,
            '--kafka_broker=' + 'localhost:9092',
            '--kafka_topic=' + 'semaphore-topic'
        ];

        super('../../jasmine_semaphore/src/bin/main', argv);
    }
}

class MobileProcess extends Process {
    constructor(configPath) {
        const argv = [
            '--config_path=' + configPath,
            '--type=' + 'process',
            '--time=' + 1000,
            '--kafka_broker=' + 'localhost:9092',
            '--kafka_topic=' + 'mobile-topic'
        ];

        super('../../jasmine_mobile/src/bin/main', argv);
    }
}

module.exports = {Process, SemaphoreProcess, MobileProcess};


