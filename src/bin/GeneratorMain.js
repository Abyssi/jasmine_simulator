const fs = require('fs');
const util = require('util');
const http = require('../Utils/HTTPUtils.js');
const RandomUtils = require('../Utils/RandomUtils.js');

const JNCoordinates = require('../../jasmine_semaphore/src/Models/JNCoordinates');
const JNLightBulb = require('../../jasmine_semaphore/src/Models/JNLightBulb');
const JNLightBulbColor = require('../../jasmine_semaphore/src/Models/JNLightBulbColor');
const JNLightBulbStatus = require('../../jasmine_semaphore/src/Models/JNLightBulbStatus');
const JNSemaphore = require('../../jasmine_semaphore/src/Models/JNSemaphore');

const JNMobile = require('../../jasmine_mobile/src/Models/JNMobile.js');

const Config = require('../Utils/Config.js');

class SemaphoreMain {
    constructor(folder, invalidate = true) {
        if (invalidate)
            this.deleteFolderRecursive(folder);

        if (!fs.existsSync(folder))
            fs.mkdirSync(folder);

        //this.generateSemaphores(folder);
        this.generateRESTSemaphores(folder);
        this.generateMobiles(folder);
    }

    deleteFolderRecursive(folder) {
        const self = this;
        if (fs.existsSync(folder)) {
            fs.readdirSync(folder).forEach(function (file) {
                const curPath = folder + file;
                if (fs.lstatSync(curPath).isDirectory())
                    self.deleteFolderRecursive(curPath);
                else
                    fs.unlinkSync(curPath);
            });
            fs.rmdirSync(folder);
        }
    };

    generateSemaphores(folder) {
        let semaphoreList = [];
        for (let c = 0; c < 100; c++) {
            for (let s = 0; s < 4; s++) {
                const lightBulbs = [
                    new JNLightBulb(JNLightBulbColor.RED, JNLightBulbStatus.OFF),
                    new JNLightBulb(JNLightBulbColor.YELLOW, JNLightBulbStatus.OFF),
                    new JNLightBulb(JNLightBulbColor.GREEN, JNLightBulbStatus.OFF)
                ];
                semaphoreList.push(new JNSemaphore(RandomUtils.randomString(10), s, new JNCoordinates(RandomUtils.randomFloat(41.836425, 41.959598, 6), RandomUtils.randomFloat(12.389655, 12.593245, 6)), 60, lightBulbs));
            }
        }

        semaphoreList.forEach(semaphore => {
            const path = util.format("%s/semaphore-%s-%s.json", folder, semaphore.crossroadsId, semaphore.semaphoreId);
            fs.writeFile(path, JSON.stringify(semaphore), 'utf8', function (err) {
                if (err) throw err;
            });
        });
    }

    generateMobiles(folder) {
        let mobileList = [];
        for (let i = 0; i < 100; i++) {
            mobileList.push(new JNMobile(RandomUtils.randomString(10)));
        }

        mobileList.forEach(mobile => {
            const path = util.format("%s/mobile-%s.json", folder, mobile.id);
            fs.writeFile(path, JSON.stringify(mobile), 'utf8', function (err) {
                if (err) throw err;
            });
        });
    }

    generateRESTSemaphores(folder) {
        let size = 100;
        http.put("http://" + Config.spring_host + "/api/v1/generate/" + size + "/true", function (statusCode, response) {
            http.getJSON("http://" + Config.spring_host + "/api/v1/crossroads/?page=0&pageSize=" + size, function (statusCode, response) {
                let semaphoreList = [];
                const crossroads = response.content;

                for (let c = 0; c < crossroads.length; c++) {
                    const crossroad = crossroads[c];
                    for (let s = 0; s < crossroad['semaphores'].length; s++) {
                        const semaphore = crossroad['semaphores'][s];
                        const crossroadsId = crossroad['id'];
                        const semaphoreId = semaphore['semaphoreId'];
                        const position = new JNCoordinates(semaphore.location.latitude, semaphore.location.longitude);
                        const greenDuration = semaphore['greenTime'];
                        const lightBulbs = [
                            new JNLightBulb(JNLightBulbColor.RED, JNLightBulbStatus.OFF),
                            new JNLightBulb(JNLightBulbColor.YELLOW, JNLightBulbStatus.OFF),
                            new JNLightBulb(JNLightBulbColor.GREEN, JNLightBulbStatus.OFF)
                        ];
                        semaphoreList.push(new JNSemaphore(crossroadsId, semaphoreId, position, greenDuration, lightBulbs));
                    }
                }
                semaphoreList.forEach(semaphore => {
                    const path = util.format("%s/semaphore-%s-%s.json", folder, semaphore.crossroadsId, semaphore.semaphoreId);
                    fs.writeFile(path, JSON.stringify(semaphore), 'utf8', function (err) {
                        if (err) throw err;
                    });
                });
            });
        });
    }
}

module.exports = SemaphoreMain;