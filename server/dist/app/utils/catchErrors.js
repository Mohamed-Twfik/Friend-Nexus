"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fn) => {
    return (request, response, next) => {
        fn(request, response, next).catch((error) => {
            next(error);
        });
    };
};
