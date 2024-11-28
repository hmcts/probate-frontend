'use strict';

const {assert} = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const express = require('express');
const helmet = require('helmet');

const app = proxyquire('app', {
    'express': express,
    'helmet': helmet,
});

describe('app-config-helmet', () => {
    it('should use helmet.strictTransportSecurity with appropriate maxAge', (done) => {
        const stsSpy = sinon.spy(helmet, 'strictTransportSecurity');

        const server = app.init();
        server.http.close();

        stsSpy.restore();

        const expectedMinimumMaxAge = 31536000;
        const seenAges = [];

        assert(
            stsSpy.calledWith(
                sinon.match.has('maxAge', sinon.match((val) => {
                    seenAges.push(val);
                    return val >= expectedMinimumMaxAge;
                }))),
            `strictTransportSecurity not called with maxAge >= ${expectedMinimumMaxAge}, saw ${seenAges.join()}`);

        const called = stsSpy.callCount;
        assert.equal(called, 1,
            `Expected strictTransportSecurity to be called once but was called ${called} times`);

        done();
    });
});
