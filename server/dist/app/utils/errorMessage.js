"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (status, message, data = []) => {
    const error = {
        message,
        status,
        data
    };
    return error;
};
