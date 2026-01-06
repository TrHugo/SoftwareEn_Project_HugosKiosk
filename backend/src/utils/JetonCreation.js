import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import { JWT_EXPIRATION} from '../utils/constant.js';
import { comparePassword } from "../utils/passwordHash.js";
import { getUserByEmailAndMail } from '../controllers/user.controller.js';

dotenv.config();

export async function login(req, res, next) {
    const { name, email, password } = req.body;
    if (name==undefined || email==undefined || password==undefined)
    {
        const err = new Error("POST error");
        err.status = 400; 
        return next(err);
    }
    try {

        const user = await getUserByEmailAndMail(name, email);

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
                userId: user._id,
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