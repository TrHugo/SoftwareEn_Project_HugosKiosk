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

        // --- MODIFICATION ICI ---
        // 1. Calcul de la nouvelle date d'expiration
        // On part TOUJOURS de la date et l'heure actuelles (Date du jour)
        let newExpirationDate = new Date();
        
        // ON A SUPPRIMÉ LE BLOC "IF" QUI REGARDAIT L'ANCIENNE DATE.
        // Maintenant, peu importe si l'utilisateur avait encore 10 jours ou 1 an,
        // on écrase tout et on repart d'aujourd'hui.

        if (planName === "Discovery") {
            // Aujourd'hui + 7 jours
            newExpirationDate.setDate(newExpirationDate.getDate() + 7); 
        } else if (planName === "Regular") {
            // Aujourd'hui + 1 mois
            newExpirationDate.setMonth(newExpirationDate.getMonth() + 1); 
        } else if (planName === "Premium") {
            // Aujourd'hui + 1 an
            newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1); 
        }

        console.log(`Reset abonnement pour User ${userId}. Nouvelle fin : ${newExpirationDate}`);

        // 2. Mise à jour MongoDB (On écrase l'ancienne date)
        const updatedUser = await User.findOneAndUpdate(
            { id: userId }, 
            { subscriptionExpiresAt: newExpirationDate }, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        // 3. Nouveau Token avec la nouvelle date
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