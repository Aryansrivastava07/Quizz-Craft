import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    console.error("Error caught by error handler:", error.message); // Log the error message

    const response = {
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    };

    return res.status(error.status).json(response);
};

export { errorHandler };
