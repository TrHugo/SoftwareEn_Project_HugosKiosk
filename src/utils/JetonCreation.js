import jwt from 'jsonwebtoken'
import { JETON_CODE, JWT_EXPIRATION, clients} from '../utils/constant.js';


export const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (email==undefined || password==undefined)
    {
        const err = new Error("POST error");
        err.status = 500; 
        return next(err);
    }
    try {
 
        const user = clients.find(a => a.email === email);
        //const user = await clients.findOne({ email });
 
        if (!user) {
            const err = new Error("E-mail ou mot de passe incorrect.");
            err.status = 401; 
            return next(err);
        }

        //const isPasswordValid = await bcrypt.compare(password, user.mdp);

        let isPasswordValid = true
        if (password == "test"){
            isPasswordValid = false;
        }

        if (!isPasswordValid) {
            const err = new Error("E-mail ou mot de passe incorrect.");
            err.status = 401; 
            return next(err);
        }

        const token = jwt.sign( 
            { 
                userId: user.id, 
                Type: user.role 
            },
            JETON_CODE,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({
            message: "Connexion réussie",
            token: token
        });

    } catch (error) {
        console.log(error)
        error.status = error.status || 500;
        next(error);
    }
};