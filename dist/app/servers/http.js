"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const v8_1 = __importDefault(require("v8"));
const uuid = __importStar(require("uuid"));
const _Frameworks_1 = require("@Frameworks");
// @ts-ignore
const { App } = _Frameworks_1.Core;
const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
const memoryData = process.memoryUsage();
const nodeJsStats = v8_1.default.getHeapStatistics();
const server1 = config_1.default.get('server1');
const corsWhiteList = config_1.default.get('corsWhiteList');
const memoryUsage = {
    rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
    heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
    heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
    external: `${formatMemoryUsage(memoryData.external)} -> VB external memory`,
};
const serverStats = {
    started: new Date(),
    uptime: 0,
    instance: server1.instanceId,
    build: server1.commitSha,
    nodeJsStats: nodeJsStats,
    memoryUsage: memoryUsage,
};
const expressApp = (0, express_1.default)();
expressApp.use((0, helmet_1.default)());
expressApp.set('trust proxy', 1);
// Set correlation id
expressApp.use('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let correlationId = req.headers['x-correlation-id'];
    if (!correlationId) {
        correlationId = uuid.v4();
    }
    res.setHeader('x-correlation-id', correlationId);
    // @ts-ignore
    req.context = {
        correlationId: correlationId,
    };
    next();
}));
const corsOptions = {
    origin: [corsWhiteList],
    credentials: true,
    'Access-Control-Allow-Credentials': true,
};
expressApp.use('/', [
    // @ts-ignore
    (0, cors_1.default)(corsOptions),
    express_1.default.json({ limit: '50mb' }),
    express_1.default.urlencoded({ extended: true }),
    // cookies
    (req, res, next) => {
        var _a;
        req.res = res,
            req.req = req,
            // log shit
            // @ts-ignore
            console.log(JSON.stringify({
                originalUrl: req.originalUrl,
                ip: (_a = req.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress,
                params: req.params,
                path: req.path,
                method: req.method,
                query: req.query,
                url: req.url,
                body: req.body,
                headers: req.headers,
                correlationId: req.context.correlationId
            }));
        return next();
    }
]);
expressApp.use('/health', (_, res) => {
    res.status(200).json(serverStats);
});
// login stuff
// hosted stuff?
// token stuff?
const router = express_1.default.Router();
// Make express app with decorators
expressApp.use('/v1', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    if (corsWhiteList.indexOf(req.headers.origin) !== -1) {
        res.set({
            'Access-Control-Allow-Origin': req.headers.origin,
            'Access-Control-Allow-Credentials': true,
        });
    }
}));
let Http = class Http {
    constructor(options = { port: config_1.default.get('server1.port') }) {
        this.options = options;
    }
    init() {
        this.app = (0, http_1.createServer)(expressApp);
        // attach routers
        expressApp.use('v1', router);
    }
    listen() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.app) === null || _a === void 0 ? void 0 : _a.listen(this.options.port, (e) => {
                if (e) {
                    reject(e);
                }
                console.log(`running on ${this.options.port}`);
                resolve(true);
            });
        });
    }
    ;
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.info('Closing server: Http');
                // Add anything like socket io connections or thread/pools that need to close in future
                console.info('Server Closed: Http');
                return 'Http succesfully closed';
            }
            catch (err) {
                console.error('Error closing Server: Http', err);
                return 'Http Errored Closing';
            }
        });
    }
};
Http = __decorate([
    App.Server(),
    __metadata("design:paramtypes", [Object])
], Http);
exports.Http = Http;
;
