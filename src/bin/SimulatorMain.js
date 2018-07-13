const JNSimulatorCore = require('./JNSimulatorCore.js');
const path = require('path');

class SimulatorMain {
    constructor(argv) {
        const folder = argv.hasOwnProperty("folder") ? argv["folder"] : '../../data/';
        const type = argv.hasOwnProperty("type") ? argv["type"] : 'instance';

        const types = {
            'instance': JNSimulatorCore.JNInstanceSimulatorCore,
            'process': JNSimulatorCore.JNProcessSimulatorCore
        };

        this.core = new types[type](path.resolve(folder) + "/");
    }
}

module.exports = SimulatorMain;