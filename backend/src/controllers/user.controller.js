import User from "../models/user.model.js"; 
import { hashPassword } from "../utils/passwordHash.js";

export async function getUserById(userId) {
    try {
        const user = await User.findOne({ id: userId }).lean();
        return user;
    } catch (error) {
        if (error.name === "CastError") return null;
        throw error;
    }
}

export async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email: email }).lean();
        return user;
    } catch (error) {
        throw error;
    }
}

export async function createUser(req, res, next) {
  try {
    const { name, email, mdp, role } = req.body;

    if (!name || !email || !mdp || !role) {
      return res.status(400).json({ error: "Tous les champs (name, email, mdp, role) sont requis." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Format de l'email invalide." });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(mdp)) {
        return res.status(400).json({ 
            error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial." 
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Cet email est déjà utilisé." });
    }

    const id = Date.now(); 

    const hashedMdp = await hashPassword(mdp);
    const created = await User.create({ id, name, email, mdp: hashedMdp, role });

    const userObj = created.toObject();
    delete userObj.mdp;

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user: userObj
    });

  } catch (err) {
    console.error("ERREUR DÉTECTÉE DANS CREATE USER :", err);
    next(err);
  }
};
