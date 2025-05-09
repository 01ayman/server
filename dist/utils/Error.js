"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chessError = exports.ChessError = void 0;
class ChessError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
        Error.captureStackTrace(this, ChessError);
    }
}
exports.ChessError = ChessError;
const chessError = ({ code, message }) => {
    return {
        code: code,
        message: message
    };
};
exports.chessError = chessError;
