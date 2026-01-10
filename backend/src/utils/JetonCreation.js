import jwt from 'jsonwebtoken'
import { JWT_EXPIRATION } from './constant.js';
import { comparePassword } from "./passwordHash.js";
import { getUserByEmail } from '../controllers/user.controller.js';

export async function login(req, res, next) {
    const { email, password } = req.body;
    
    if (email === undefined || password === undefined) {
        const err = new Error("POST error : Email ou mot de passe manquant");
        err.status = 400; 
        return next(err);
    }

    try {
        console.log("Tentative de login pour:", email);
        const user = await getUserByEmail(email);

        if (!user) {
            const err = new Error("E-mail ou mot de passe incorrect.");
            err.status = 401; 
            return next(err);
        }

        const isPasswordValid = await comparePassword(password, user.mdp);

        if (!isPasswordValid) {
            const err = new Error("E-mail ou mot de passe incorrect.");
            err.status = 401; 
            return next(err);
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscriptionExpiresAt: user.subscriptionExpiresAt 
            },
            process.env.JETON_CODE,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({
            message: "Connexion réussie",
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                subscriptionExpiresAt: user.subscriptionExpiresAt
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        error.status = error.status || 500;
        next(error);
    }
}
