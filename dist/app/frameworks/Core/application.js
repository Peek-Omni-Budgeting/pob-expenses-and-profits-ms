"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.Application_ = void 0;
const server_1 = require("./server");
class Application_ {
    constructor(options) {
        this.options = options;
        this.serverManager = new server_1.ServerManager;
    }
    Server() {
        return this.serverManager.MakeResourceDecorator();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.serverManager.init();
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            let Exit = (err) => __awaiter(this, void 0, void 0, function* () {
                try {
                    Exit = (err) => __awaiter(this, void 0, void 0, function* () { });
                    if (err)
                        console.error(`Stopping application an error ocurred, Error: ${err}, Message: ${err.message}, Stack: ${err.stack}`);
                    console.log('Stopping application');
                    yield this.stop();
                    console.log('Shutting down node');
                }
                catch (shutDownErr) {
                    console.error(`An error occured during shutdown, Error: ${shutDownErr}, Message: ${shutDownErr.message}, Stack: ${shutDownErr.stack}`);
                }
                finally {
                    process.exit(0);
                }
            });
            process.on('SIGINT', Exit);
            process.on('uncaughtException', Exit);
            console.log('Initializing servers and data sources');
            try {
                console.info('Starting servers');
                console.log(this.serverManager.getServers());
                yield this.serverManager.callStart();
                console.log('started');
            }
            catch (err) {
                console.error(`Error: ${err}`);
                process.exit(-1);
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('Stopping');
            try {
                console.log('Stopping servers', this.serverManager.getServers());
                const serverStopResults = yield this.serverManager.callStop();
                console.log('Servers stopped', serverStopResults);
            }
            catch (err) {
                console.error(`Error stopping servers, Error: ${err}, Message: ${err.message}, Stack: ${err.stack}`);
            }
            console.log('Stopped');
        });
    }
    Api(ctor) {
        return (0, server_1.Api)(ctor);
    }
    getServer(name) {
        return this.serverManager.getServer(name);
    }
}
exports.Application_ = Application_;
function Application(options = {}) {
    if (!options.name) {
        options.name = 'POB-Expenses-And-Profits';
    }
    if (!options.listenerCount) {
        options.listenerCount = 10e6;
    }
    return new Application_(options);
}
exports.Application = Application;
