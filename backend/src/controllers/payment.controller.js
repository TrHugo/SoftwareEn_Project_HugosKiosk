import User from '../models/user.model.js'; 
import jwt from 'jsonwebtoken';
import { JWT_EXPIRATION } from '../utils/constant.js'; 

export const confirmPayment = async (req, res, next) => {
    try {
        const userId = Number(req.userId); 
        const { planName } = req.body; 

        if (!planName) {
            return res.status(400).json({ message: "Nom du plan manquant" });
        }

        let newExpirationDate = new Date();
        
        if (planName === "Discovery") {
            newExpirationDate.setDate(newExpirationDate.getDate() + 7); 
        } else if (planName === "Regular") {
            newExpirationDate.setMonth(newExpirationDate.getMonth() + 1); 
        } else if (planName === "Premium") {
            newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1); 
        }

        console.log(`Reset abonnement pour User ${userId}. Nouvelle fin : ${newExpirationDate}`);

        const updatedUser = await User.findOneAndUpdate(
            { id: userId }, 
            { subscriptionExpiresAt: newExpirationDate }, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const newToken = jwt.sign(
            {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                subscriptionExpiresAt: updatedUser.subscriptionExpiresAt 
            },
            process.env.JETON_CODE,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({
            message: "Paiement validé",
            token: newToken,
            user: updatedUser
        });

    } catch (error) {
        console.error("Erreur Backend Paiement:", error);
        next(error);
    }
};
