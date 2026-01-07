import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
const JETON_CODE = process.env.JETON_CODE || 'test_jwt_code';

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

const token_a = jwt.sign(
    { Id: 1, Type: "admin" },
    JETON_CODE,
    { expiresIn: '1h' } 
);
export const VALID_TEST_TOKEN_A = token_a;

const token_ma = jwt.sign(
    { Id: 999, Type: "admin" },
    JETON_CODE,
    { expiresIn: '1h' } 
);
export const VALID_TEST_TOKEN_MA = token_ma;

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