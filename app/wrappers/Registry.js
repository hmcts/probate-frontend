'use strict';

class Registry {
    constructor(registry) {
        this.registry = registry || {};
    }

    address() {
        return this.registry.address ? this.registry.address : '';
    }
}

module.exports = Registry;
