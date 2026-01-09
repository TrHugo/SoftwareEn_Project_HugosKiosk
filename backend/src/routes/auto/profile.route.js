import { Router } from "express";
import { checkUser, checkRole } from '../../utils/JetonVerification.js';
import { publisher_profile_access, user_profile_access, admin_profile_access } from "../../utils/constant.js";
import { getUserById } from "../../controllers/user.controller.js";

const router = Router();

// --- Fonction générique pour éviter la répétition de code ---
const getProfileGeneric = async (req, res, next) => {
    try {
        // L'ID est passé dans l'URL (ex: /profile/user/12345)
        const targetId = req.params.userID; 
        const requesterId = req.userId; // Vient du token (checkUser)

        // 1. Vérif format ID
        if (isNaN(Number(targetId))) {
            const err = new Error("ID incorrect (doit être un nombre)");
            err.status = 400;   
            return next(err);
        }

        // 2. Vérification de sécurité : Est-ce que je demande MON propre profil ?
        // On compare des Strings pour éviter les soucis de type (Number vs String)
        if (String(requesterId) !== String(targetId)) {
            const err = new Error("Accès refusé : Vous ne pouvez consulter que votre propre profil.");
            err.status = 403; 
            return next(err);
        }

        // 3. Récupération en base
        const user = await getUserById(targetId);

        if (user) {
            // On retire le mot de passe avant d'envoyer (sécurité doublée)
            const { mdp, ...userInfo } = user;
            res.status(200).json({
                success: true,
                info: userInfo
            });
        } else {
            const err = new Error("Utilisateur introuvable");
            err.status = 404;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
};

// --- Routes ---

// Route simple (Moi-même)
router.get('/profile', checkUser, async (req, res, next) => {
    try {
        const id = Number(req.userId);
        const type = req.userRole;
        // On renvoie juste les infos basiques du token ici, ou on pourrait faire un appel BDD aussi
        res.status(200).json({ success: true, info: { id, type } });
    } catch (error) {
        const err = new Error("Failed to retrieve profile info");
        err.status = 500;
        return next(err);
    }
});

// Routes spécifiques par rôle (mais qui utilisent toutes la même logique !)
router.get('/profile/publisher/:userID', checkUser, checkRole(publisher_profile_access), getProfileGeneric);
router.get('/profile/user/:userID',      checkUser, checkRole(user_profile_access),      getProfileGeneric);
router.get('/profile/admin/:userID',     checkUser, checkRole(admin_profile_access),     getProfileGeneric);

export default router;