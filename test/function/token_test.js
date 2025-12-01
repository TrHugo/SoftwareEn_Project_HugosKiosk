import jwt from 'jsonwebtoken';
import {JETON_CODE} from '../../src/utils/constant.js'
const user_u = { Id: 1, Type: "user" };

const token_u = jwt.sign(
    user_u,
    JETON_CODE,
    { expiresIn: '1h' } 
);
export const VALID_TEST_TOKEN_U = token_u;

const user_mu = { Id: 999, Type: "user" };

const token_mu = jwt.sign(
    user_mu,
    JETON_CODE,
    { expiresIn: '1h' } 
);
export const VALID_TEST_TOKEN_MU = token_mu;

const user_p = { Id: 1, Type: "publisher" };

const token_p = jwt.sign(
    user_p,
    JETON_CODE,
    { expiresIn: '1h' } 
);
export const VALID_TEST_TOKEN_P = token_p;

const user_mp = { Id: 999, Type: "publisher" };

const token_mp = jwt.sign(
    user_mp,
    JETON_CODE,
    { expiresIn: '1h' } 
);
export const VALID_TEST_TOKEN_MP = token_mp;