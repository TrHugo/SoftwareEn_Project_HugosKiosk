import { Router } from "express";
import { checkUser, checkRole} from '../../utils/JetonVerification';
import { publisher_profile_access } from "../../utils/constant.js";

const router = express.Router();

router.get('/profile/publisher/:userID'), checkUser, checkRole(publisher_profile_access), (req, res, next) =>{
    const publisherId = parseInt(req.params.userID, 10);

    if (req.userData.userId!=publisherId)
    {
        const err = new Error("Access refused");
        err.status = 403; 
        return next(err);
    }

    if (isNaN(publisherId)) {
        const err = new Error("Publisher ID incorrect");
        err.status = 400;   //A verifier
        return next(err);
    }

    // A remplacer avec recherche dans database
    const user = publishers.find(a => a.id === publisherId);

    if (user) {
        res.json({
            success: true,
            article: user
        });
    }
    else {
        const err = new Error("User not found");
        err.status = 500; //A verifier
        return next(err);
    }
}