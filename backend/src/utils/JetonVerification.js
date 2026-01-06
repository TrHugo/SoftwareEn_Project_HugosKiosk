import { JETON_CODE } from '../utils/constant.js' //To change
import jwt from 'jsonwebtoken';

export const checkUser = (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(" ")[1]; 
        const decodedToken = jwt.verify(token, JETON_CODE);
        if (!decodedToken.Id || !decodedToken.Type) {
            throw new Error("Missing essential user data in token.");
        }

        req.userData = { userId: decodedToken.Id };
        req.userType = { userType:decodedToken.Type };

        next();

    } catch (error) {
        console.error("caught error : ",error.message);
        const err = new Error("Failed Authentification. Access refused");
        err.status = 401;
        return next(err);
    }
};
export const checkRole = (requiredRoles) => {
    return (req, res, next) => {
       
        if (!req.userType || !requiredRoles) {
            const err = new Error("No role found");
            err.status = 500;
            return next(err);
        }

        const userRole = req.userType.userType;

        if (requiredRoles.includes(userRole)) {
            next();
        } 
        else {
            const err = new Error(`Access Forbidden`);
            err.status = 403; 
            return next(err);
        }
    };
};
