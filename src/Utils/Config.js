#!/usr/bin/env node

module.exports = Object.freeze({
    //spring_host: 'www.jasmine.cf:32082',
    spring_host: 'localhost:8082',
    //kafka_broker: 'www.jasmine.cf:32094',
    kafka_broker: 'localhost:9092',

    semaphore_type: 'virtual',
    //semaphore_time: 1000, //Development value
    semaphore_time: 60000, //Real value
    semaphore_kafka_topic: 'semaphore-topic',

    mobile_type: 'virtual',
    //mobile_time: 1000, //Development value
    mobile_time: 10000, //Real value
    mobile_kafka_topic: 'mobile-topic',
});