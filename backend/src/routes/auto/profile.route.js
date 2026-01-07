import { Router } from "express";
import { checkUser, checkRole} from '../../utils/JetonVerification.js';
import { publisher_profile_access, user_profile_access, admin_profile_access} from "../../utils/constant.js";
import { getUserById } from "../../controllers/user.controller.js";

const router = Router();

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

router.get('/profile/publisher/:userID', checkUser, checkRole(publisher_profile_access), async (req, res, next) =>{
    const publisherId = String(req.params.userID);

     if (isNaN(Number(publisherId))) {
        const err = new Error("Publisher ID incorrect");
        err.status = 400;   
        return next(err);
    }

    if (req.userId !== publisherId)
    {
        const err = new Error("Access refused");
        err.status = 403; 
        return next(err);
    }


    const publisher = await getUserById(publisherId);

    if (publisher) {
        res.status(200).json({
            success: true,
            info: publisher
        });
    }
    else {
        const err = new Error("Publisher user not found");
        err.status = 404;
        return next(err);
    }
});
router.get('/profile/user/:userID', checkUser, checkRole(user_profile_access), async (req, res, next) =>{
    const userId = String(req.params.userID);


    if (isNaN(Number(userId))) {
        const err = new Error("User ID incorrect");
        err.status = 400;   
        return next(err);
    }

    if (req.userId != userId)
    {
        const err = new Error("Access refused");
        err.status = 403; 
        return next(err);
    }

    const user = await getUserById(userId);

    if (user) {
        res.status(200).json({
            success: true,
            info: user
        });
    }
    else {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
    }

});

router.get('/profile/admin/:userID', checkUser, checkRole(admin_profile_access), async (req, res, next) =>{
    const adminId = String(req.params.userID);


    if (isNaN(Number(adminId))) {
        const err = new Error("Admin ID incorrect");
        err.status = 400;   
        return next(err);
    }

    if (req.userId != adminId)
    {
        const err = new Error("Access refused");
        err.status = 403; 
        return next(err);
    }

    const admin = await getUserById(adminId);

    if (admin) {
        res.status(200).json({
            success: true,
            info: admin
        });
    }
    else {
        const err = new Error("Admin not found");
        err.status = 404;
        return next(err);
    }
});

export default router