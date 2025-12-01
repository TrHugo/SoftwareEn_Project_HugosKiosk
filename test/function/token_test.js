import jwt from 'jsonwebtoken';
import {JETON_CODE} from '../../src/utils/constant.js'

// Les mêmes informations utilisées dans votre mockCheckUser
//const JETON_CODE = "moHk9oFd-7ka4(lH_fK40"; 
const user = { Id: "1", Type: "user" };

const token = jwt.sign(
    user,
    JETON_CODE,
    { expiresIn: '1h' } // Le temps d'expiration n'a pas d'importance pour les tests immédiats
);
export const VALID_TEST_TOKEN = token;