import { Router } from "express";
import { checkUser, checkRole} from '../../utils/JetonVerification.js';
import { publisher_profile_access, user_profile_access, publishers } from "../../utils/constant.js";

const router = Router();

router.get('/profile/publisher/:userID', checkUser, checkRole(publisher_profile_access), (req, res, next) =>{
    const publisherId = parseInt(req.params.userID, 10);

     if (isNaN(publisherId)) {
        const err = new Error("Publisher ID incorrect");
        err.status = 400;   //A verifier
        return next(err);
    }

    if (parseInt(req.userData.userId,10)!=publisherId)
    {
        const err = new Error("Access refused");
        err.status = 403; 
        return next(err);
    }

    // A remplacer avec recherche dans database
    const publisher = publishers.find(a => a.id === publisherId);

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
router.get('/profile/user/:userID', checkUser, checkRole(user_profile_access), (req, res, next) =>{
const userId = parseInt(req.params.userID, 10);

    if (req.userData.userId!=userId)
    {
        const err = new Error("Access refused");
        err.status = 403; 
        return next(err);
    }

    // A remplacer avec recherche dans database
    const user = users.find(a => a.id === userId);

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
export default router