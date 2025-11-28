import { Jeton_secret_code } from '../constant.js' //To change

const jwt = require('jsonwebtoken');

export const checkUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; 

        const decodedToken = jwt.verify(token, Jeton_secret_code);
        
        req.userData = { userId: decodedToken.userId };
        req.userType = { userType:decodedToken.Type };
        
        next();

    } catch (error) {
        const err = new Error("Failed Authentification. Access refused");
        err.status = 401;
        return next(err);
    }
};
export const checkRole = (requiredRoles) => {
    return (req, res, next) => {
       
        if (!req.userType || !req.userType.userType) {
            const err = new Error("No type of user found");
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
