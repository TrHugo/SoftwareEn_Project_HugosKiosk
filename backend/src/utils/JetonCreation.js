import jwt from 'jsonwebtoken'
// Assure-toi que le chemin vers constant est bon (si c'est dans le même dossier utils)
import { JWT_EXPIRATION } from './constant.js';
import { comparePassword } from "./passwordHash.js";
// On remonte d'un cran (..) pour aller chercher les controllers
import { getUserByEmail } from '../controllers/user.controller.js';

export async function login(req, res, next) {
    const { email, password } = req.body;
    
    // Vérification basique
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

        // --- C'EST ICI QUE SE JOUE LA PERSISTANCE ---
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                // CORRECTION CRITIQUE : On met le bon nom du champ DB dans le token
                subscriptionExpiresAt: user.subscriptionExpiresAt 
            },
            process.env.JETON_CODE,
            { expiresIn: JWT_EXPIRATION }
        );

        // On renvoie la réponse au Frontend
        res.status(200).json({
            message: "Connexion réussie",
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                // On renvoie aussi la date au frontend pour l'affichage immédiat
                subscriptionExpiresAt: user.subscriptionExpiresAt
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        error.status = error.status || 500;
        next(error);
    }
}