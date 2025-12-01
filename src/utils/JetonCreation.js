import jwt from 'jsonwebtoken'
import { JETON_CODE, JWT_EXPIRATION, client} from '../utils/constant.js';


export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await client.findOne({ email });

        if (!user) {
            const err = new Error("E-mail ou mot de passe incorrect.");
            err.status = 401; 
            return next(err);
        }

        //const isPasswordValid = await bcrypt.compare(password, user.password);
        isPasswordValid = true

        if (!isPasswordValid) {
            const err = new Error("E-mail ou mot de passe incorrect.");
            err.status = 401; 
            return next(err);
        }

        const token = jwt.sign(
            { 
                userId: user._id, 
                Type: user.role 
            },
            Jeton_secret_code,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({
            message: "Connexion réussie",
            token: token,
            userId: user._id,
            userType: user.role
        });

    } catch (error) {
        error.status = error.status || 500;
        next(error);
    }
};