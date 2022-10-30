"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const _Frameworks_1 = require("@Frameworks");
// @ts-ignore
exports.App = _Frameworks_1.Core.App;
exports.App
    .init()
    .then(() => {
    exports.App.start().then(() => {
        console.log('We are running!');
    }).catch((e) => {
        console.error(e);
        process.exit(-1);
    });
}).catch((e) => {
    console.error(e);
    process.exit(-1);
});
