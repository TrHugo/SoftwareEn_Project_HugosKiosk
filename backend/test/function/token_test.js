import jwt from 'jsonwebtoken';
import {JETON_CODE} from '../../src/utils/constant.js'

const token_u = jwt.sign(
    { Id: 1, Type: "user" },
    JETON_CODE,
    { expiresIn: '1h' } 
);
export const VALID_TEST_TOKEN_U = token_u;

const token_mu = jwt.sign(
    { Id: 999, Type: "user" },
    JETON_CODE,
    { expiresIn: '1h' } 
);
export const VALID_TEST_TOKEN_MU = token_mu;


const token_p = jwt.sign(
    { Id: 1, Type: "publisher" },
    JETON_CODE,
    { expiresIn: '1h' } 
);
export const VALID_TEST_TOKEN_P = token_p;

const token_mp = jwt.sign(
    { Id: 999, Type: "publisher" },
    JETON_CODE,
    { expiresIn: '1h' } 
);
export const VALID_TEST_TOKEN_MP = token_mp;

const token_no_data = jwt.sign(
    {},
    JETON_CODE,
    { expiresIn: '1h' } 
);
export const TEST_TOKEN_NO_DATA = token_no_data;

const token_false = jwt.sign(
    { Id: 1, Type: "publisher" },
    "false_code",
    { expiresIn: '1h' } 
);
export const FALSE_TEST_TOKEN = token_false;