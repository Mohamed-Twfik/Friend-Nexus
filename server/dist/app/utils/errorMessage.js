"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (status, message) => {
    const error = {
        message,
        status,
    };
    return error;
};
