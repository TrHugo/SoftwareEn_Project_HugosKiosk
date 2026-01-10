import express from 'express';
import { confirmPayment } from '../../controllers/payment.controller.js';
import { checkUser } from '../../utils/JetonVerification.js';

const router = express.Router();

router.post('/payment/confirm', checkUser, confirmPayment);

export default router;
