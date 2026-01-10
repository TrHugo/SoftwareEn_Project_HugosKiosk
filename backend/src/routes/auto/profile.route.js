import { Router } from "express";
import { checkUser, checkRole } from '../../utils/JetonVerification.js';
import { publisher_profile_access, user_profile_access, admin_profile_access } from "../../utils/constant.js";
import { getUserById } from "../../controllers/user.controller.js";

const router = Router();

const getProfileGeneric = async (req, res, next) => {
    try {
        const targetId = req.params.userID; 
        const requesterId = req.userId;

        if (isNaN(Number(targetId))) {
            const err = new Error("ID incorrect (doit être un nombre)");
            err.status = 400;   
            return next(err);
        }

        if (String(requesterId) !== String(targetId)) {
            const err = new Error("Accès refusé : Vous ne pouvez consulter que votre propre profil.");
            err.status = 403; 
            return next(err);
        }

        const user = await getUserById(targetId);

        if (user) {
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

router.get('/profile', checkUser, async (req, res, next) => {
    try {
        const id = Number(req.userId);
        const type = req.userRole;
        res.status(200).json({ success: true, info: { id, type } });
    } catch (error) {
        const err = new Error("Failed to retrieve profile info");
        err.status = 500;
        return next(err);
    }
});

router.get('/profile/publisher/:userID', checkUser, checkRole(publisher_profile_access), getProfileGeneric);
router.get('/profile/user/:userID',      checkUser, checkRole(user_profile_access),      getProfileGeneric);
router.get('/profile/admin/:userID',     checkUser, checkRole(admin_profile_access),     getProfileGeneric);

export default router;
