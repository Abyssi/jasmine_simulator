const SemaphoreMain = require('../../jasmine_semaphore/src/bin/SemaphoreMain.js');
const MobileMain = require('../../jasmine_mobile/src/bin/MobileMain.js');
const Config = require('../Utils/Config.js');

class Instance {
    constructor() {
        this.child = null;
    }

    send(message) {
        this.child.core.listener.send(message);
    }

    exit() {
        this.child.core.listener.stop();
        this.child.core.timer.stop();
    }
}

class SemaphoreInstance extends Instance {
    constructor(configPath) {
        super();
        const argv = {
            config_path: configPath,
            type: Config.semaphore_type,
            time: Config.semaphore_time,
            kafka_broker: Config.kafka_broker,
            kafka_topic: Config.semaphore_kafka_topic
        };

        this.child = new SemaphoreMain(argv);
    }
}

class MobileInstance extends Instance {
    constructor(configPath) {
        super();
        const argv = {
            config_path: configPath,
            type: Config.mobile_type,
            time: Config.mobile_time,
            kafka_broker: Config.kafka_broker,
            kafka_topic: Config.mobile_kafka_topic
        };

        this.child = new MobileMain(argv);
    }
}

module.exports = {Instance, SemaphoreInstance, MobileInstance};