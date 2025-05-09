export class ChessError extends Error {
    code: number;
    message: string;
    constructor(code: number, message: string) {
        super(message);
        this.code = code;
        this.message = message;
        Error.captureStackTrace(this, ChessError);
    }
}

interface errorProps {
    code: number,
    message: string
}
export const chessError = ({code, message}: errorProps) => {
    return {
        code: code,
        message: message
    }
}