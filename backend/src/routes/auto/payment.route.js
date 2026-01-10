import express from 'express';
// Attention aux chemins : on remonte de 2 niveaux (../../) car on est dans routes/auto
import { confirmPayment } from '../../controllers/payment.controller.js';
import { checkUser } from '../../utils/JetonVerification.js';

const router = express.Router();

// L'app.js monte ce routeur sur "/api".
// Donc on ajoute "/payment/confirm" ici.
// URL Finale : /api + /payment/confirm = /api/payment/confirm
router.post('/payment/confirm', checkUser, confirmPayment);

export default router;