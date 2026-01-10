import jwt from 'jsonwebtoken';

export const checkUser = (req, res, next) => {
    try {
        if (!req.headers || !req.headers.authorization) {
            throw new Error('No authorization header');
        }
        const token = req.headers.authorization.split(" ")[1]; 
        let decodedToken = jwt.verify(token, process.env.JETON_CODE);

        if (decodedToken.id === undefined || decodedToken.role === undefined) {
            throw new Error("Missing essential user data in token.");
        }

        req.userId = String(decodedToken.id);
        req.userRole = String(decodedToken.role);

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
        if (!req.userRole || !requiredRoles) {
            const err = new Error("No role found");
            err.status = 500;
            return next(err);
        }

        const userRole = req.userRole;

        if (requiredRoles.includes(userRole)) {
            return next();
        } 
        else {
            const err = new Error(`Access Forbidden`);
            err.status = 403; 
            return next(err);
        }
    };
};
