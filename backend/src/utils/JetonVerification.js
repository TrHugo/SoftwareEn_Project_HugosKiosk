import jwt from 'jsonwebtoken';

export const checkUser = (req, res, next) => {
    try {
        if (!req.headers || !req.headers.authorization) {
            throw new Error('No authorization header');
        }

        const token = req.headers.authorization.split(" ")[1]; 
        const decodedToken = jwt.verify(token, process.env.JETON_CODE);

        if (!decodedToken.id || !decodedToken.role) {
            throw new Error("Missing essential user data in token.");
        }

        req.userId = String(decodedToken.id);
        req.userRole = String(decodedToken.role);
        req.subscriptionExpiresAt = decodedToken.subscriptionExpiresAt;

        next();

    } catch (error) {
        console.error("Auth Error:", error.message);
        const err = new Error("Authentification échouée. Accès refusé.");
        err.status = 401;
        return next(err);
    }
};

export const checkRole = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.userRole || !requiredRoles) {
            const err = new Error("Rôle introuvable");
            err.status = 500;
            return next(err);
        }

        if (requiredRoles.includes(req.userRole)) {
            return next();
        } else {
            const err = new Error("Accès interdit : Droits insuffisants");
            err.status = 403; 
            return next(err);
        }
    };
};

export const CheckSubsription = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JETON_CODE);
        
        const expirationDate = decodedToken.subscriptionExpiresAt;

        if (!expirationDate || new Date(expirationDate) < new Date()) {
            const err = new Error("No subscription or subscription expired");
            err.status = 403; 
            return next(err);
        }

        next();
    } catch (error) {
        const err = new Error("Subscription verification failed");
        err.status = 401;
        return next(err);
    }
};
