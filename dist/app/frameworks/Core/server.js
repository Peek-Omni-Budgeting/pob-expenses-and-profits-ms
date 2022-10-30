"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = exports.ServerManager = void 0;
const resource_1 = require("./resource");
class ServerManager extends resource_1.ResourceManager {
    constructor() {
        super();
    }
    createTimeoutRejection(t, name) {
        return new Promise(reject => {
            setTimeout(reject, t, `${name} Timeout on Close`);
        });
    }
    ;
    callStart() {
        console.log("??");
        return Promise.all(Object.keys(this.connections).map((con) => {
            console.log(this.connections[con]);
            return this.connections[con].listen();
        }));
    }
    ;
    callStop() {
        return Promise.all(Object.keys(this.connections).map((con) => {
            const Timeout = this.connections[con]._closeTimeout ? this.connections[con]._closeTimeout : 5000;
            return Promise.race([this.connections[con].close(), this.createTimeoutRejection(Timeout, con)]);
        }));
    }
    ;
    getServer(name) {
        if (typeof name === 'string') {
            return this.connections[name];
        }
        return this.connections[name.name];
    }
    ;
    getServers(extended = false) {
        if (extended)
            return this.connections;
        return Object.keys(this.connections);
    }
    ;
    MakeResourceDecorator() {
        const soup = super.MakeResourceDecorator();
        return function (ctor) {
            Reflect.set(ctor.prototype, 'services', []);
            return soup(ctor);
        }.bind(this);
    }
}
exports.ServerManager = ServerManager;
;
function Api(ctor) {
    return function ApiInner(srvCtor) {
        const arr = Reflect.get(srvCtor.prototype, 'services');
        arr.push(ctor.expressRouter);
        Reflect.set(srvCtor.prototype, 'services', arr);
        return srvCtor;
    };
}
exports.Api = Api;
