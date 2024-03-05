"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fn) => {
    return (request, response, next) => {
        fn(request, response, next).catch((error) => {
            const status = error.status || 500;
            const message = error.message || "Something went wrong";
            const errResponse = { status, message };
            next(errResponse);
        });
    };
};
