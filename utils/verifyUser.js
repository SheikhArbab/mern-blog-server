import { errorHandler } from "../middlewares/errorHandler.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {

    const {token} = req.cookies 

    if (!token) return next(errorHandler(401, 'Unauthorized'))

    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY)
        next()
    } catch (error) {
        next(error)
    }

}