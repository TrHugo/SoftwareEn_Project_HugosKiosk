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

export async function getUserByEmailAndMail(name, email) {
    try {
        const user = await User.findOne({ email: email, name: name }).lean();
        return user;
    } catch (error) {
        throw error;
    }
}

export async function createUser(req, res, next) {
  try {
    const { name, email, mdp, type } = req.body;

    // 1. Vérification des champs requis
    if (!name || !email || !mdp || !type) {
      return res.status(400).json({ error: "Tous les champs (name, email, mdp, type) sont requis." });
    }

    // 2. Validation Email (Regex simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Format de l'email invalide." });
    }

    // 3. Validation Mot de passe (1 Maj, 1 Min, 1 Chiffre, 1 Spécial, Min 8 chars)
    // (?=.*[\W_]) signifie "au moins un caractère non-alphanumérique"
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(mdp)) {
        return res.status(400).json({ 
            error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial." 
        });
    }

    // 4. Vérification d'existence
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Cet email est déjà utilisé." });
    }

    // 5. Génération d'ID plus robuste (Timestamp)
    // Cela génère un nombre unique basé sur l'heure actuelle. 
    // Bien plus sûr que (lastId + 1) pour éviter les doublons.
    const id = Date.now(); 

    // 6. Hachage et Création
    const hashedMdp = await hashPassword(mdp);
    const created = await User.create({ id, name, email, mdp: hashedMdp, type });

    // 7. Nettoyage de la réponse (On retire le mdp)
    const userObj = created.toObject();
    delete userObj.mdp;

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user: userObj
    });

  } catch (err) {
    next(err);
  }
};