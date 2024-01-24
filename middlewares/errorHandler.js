export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Handling Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message);
        error = new Error(message);
        res.status(400); // Bad Request
    }

    // Handling Mongoose duplicate key errors
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new Error(message);
        res.status(400); // Bad Request
    }

    // Wrong Mongoose Object ID Error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new Error(message);
        res.status(404); // Not Found
    }

    if (err.name === 'JsonWebTokenError') {
        const message = 'JSON Web Token is invalid, Try again';
        error = new Error(message);
        res.status(401); // Unauthorized
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'JSON Web Token is Expired, Try again';
        error = new Error(message);
        res.status(401); // Unauthorized
    }

    res.json({
        success: false,
        message: error.message,
    });
};
