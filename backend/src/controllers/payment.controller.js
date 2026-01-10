import User from '../models/user.model.js'; 
import jwt from 'jsonwebtoken';
// Assure-toi que le chemin vers constant.js est bon pour récupérer JWT_EXPIRATION
import { JWT_EXPIRATION } from '../utils/constant.js'; 

export const confirmPayment = async (req, res, next) => {
    try {
        const userId = req.userId; // Récupéré grâce au middleware checkUser
        const { planName } = req.body; // "Discovery", "Regular", "Premium"

        if (!planName) {
            return res.status(400).json({ message: "No subscription plan provided" });
        }

        // 1. Calcul de la nouvelle date d'expiration
        // On commence par "Maintenant"
        let newExpirationDate = new Date();
        
        // On cherche l'user pour voir s'il a déjà un abo en cours
        const currentUser = await User.findOne({ id: userId });
        
        // S'il a un abo valide qui finit dans le futur, on prolonge à partir de cette date future
        if (currentUser && currentUser.subscriptionExpiresAt && new Date(currentUser.subscriptionExpiresAt) > new Date()) {
             newExpirationDate = new Date(currentUser.subscriptionExpiresAt);
        }

        // Ajout du temps selon le plan
        if (planName === "Discovery") {
            newExpirationDate.setDate(newExpirationDate.getDate() + 7); // +7 jours
        } else if (planName === "Regular") {
            newExpirationDate.setMonth(newExpirationDate.getMonth() + 1); // +1 mois
        } else if (planName === "Premium") {
            newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1); // +1 an
        }

        // 2. Mise à jour dans MongoDB
        const updatedUser = await User.findOneAndUpdate(
            { id: userId }, 
            { subscriptionExpiresAt: newExpirationDate }, 
            { new: true } // Renvoie l'utilisateur mis à jour
        );

        if (!updatedUser) {
            throw new Error("unfound user");
        }

        // 3. GÉNÉRATION DU NOUVEAU TOKEN (CRUCIAL)
        // C'est ici qu'on "grave" la nouvelle date dans le jeton
        const newToken = jwt.sign(
            {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                subscriptionExpiresAt: updatedUser.subscriptionExpiresAt // La nouvelle date !
            },
            process.env.JETON_CODE,
            { expiresIn: JWT_EXPIRATION }
        );

        // 4. Réponse
        res.status(200).json({
            message: "Payment successful",
            token: newToken, // Le frontend devra stocker ce nouveau token
            user: updatedUser
        });

    } catch (error) {
        next(error);
    }
};