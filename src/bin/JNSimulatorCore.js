const JNSimulator = require('./JNSimulator.js');
const Timer = require('../Utils/Timer.js');
const RandomUtils = require('../Utils/RandomUtils.js');

const InstanceManager = require('../Model/InstanceManager.js');
const Instance = require('../Model/Instance.js');

const ProcessManager = require('../Model/ProcessManager.js');
const Process = require('../Model/Process.js');

class JNSimulatorCore {
    constructor(folder, managerType, semaphoreType, mobileType) {
        require('../Utils/MethodBinder.js').bindMethods(this, ['updateTick']);

        this.semaphoreSimulator = new JNSimulator(folder, "semaphore", new managerType(), semaphoreType);
        this.mobileSimulator = new JNSimulator(folder, "mobile", new managerType(), mobileType);

        this.timer = new Timer(this.updateTick);
        this.timer.start(100);
    }

    updateTick() {
        this.semaphoreSimulator.forEach(function (semaphore) {
            for (let i = 0; i < RandomUtils.randomInteger(0, 5); i++) {
                //semaphore.send({speed: 50});
                semaphore.send({speed: RandomUtils.randomFloat(10, 100, 2)});
            }
        });

        this.mobileSimulator.forEach(function (mobile) {
            for (let i = 0; i < RandomUtils.randomInteger(0, 5); i++) {
                //mobile.send({position: {latitude: 41.8980115, longitude: 12.49145}, speed: 50});
                mobile.send({
                    position: {
                        latitude: RandomUtils.randomFloat(41.836425, 41.959598, 6),
                        longitude: RandomUtils.randomFloat(12.389655, 12.593245, 6)
                    }, speed: RandomUtils.randomFloat(10, 100, 2)
                });
            }
        });
    }
}

class JNProcessSimulatorCore extends JNSimulatorCore {
    constructor(folder) {
        super(folder, ProcessManager, Process.SemaphoreProcess, Process.MobileProcess)
    }
}

class JNInstanceSimulatorCore extends JNSimulatorCore {
    constructor(folder) {
        super(folder, InstanceManager, Instance.SemaphoreInstance, Instance.MobileInstance)
    }
}

module.exports = {JNSimulatorCore, JNProcessSimulatorCore, JNInstanceSimulatorCore};



