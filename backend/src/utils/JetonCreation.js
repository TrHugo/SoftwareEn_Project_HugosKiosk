import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import { JWT_EXPIRATION} from '../utils/constant.js';
import { comparePassword } from "../utils/passwordHash.js";
import { getUserByEmail } from '../controllers/user.controller.js';

dotenv.config();

export async function login(req, res, next) {
    const { email, password } = req.body;
    if (email==undefined || password==undefined)
    {
        const err = new Error("POST error");
        err.status = 400; 
        return next(err);
    }
    try {

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
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JETON_CODE,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({
            message: "Connexion réussie",
            token
        });

    } catch (error) {
        console.log(error)
        error.status = error.status || 500;
        next(error);
    }
}