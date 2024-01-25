import jwt from "jsonwebtoken"; 

// isAuthenticated middleware
export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token) {
        return next(new Error("Please login to get access"));
    }

    try {
        const { payload } = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        req.validUser = payload;
        next();
    } catch (error) {
        return next(new Error("Invalid token. Please login again."));
    }
}

// isAuthorized middleware
export const isAuthorized = (...roles) => {
    return (req, res, next) => { 
        if (!req.validUser.IsAdmin) {
            return next(new Error(`Not allowed to access this resource`));
        }
        next();
    }
}
