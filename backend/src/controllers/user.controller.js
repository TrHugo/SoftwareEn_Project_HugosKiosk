import User from "../models/user.model.js"; 
import { hashPassword } from "../utils/passwordHash.js";

export async function getUserById(userId) {
    try {
        const user = await User.findById(userId).exec();
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

export async function createUser (req, res, next) {
  try {
    const { name, email, mdp, type } = req.body;
    if (!name || !email || !mdp || !type) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already used" });
    }

    const hashedMdp = await hashPassword(mdp);

    const created = await User.create({ name, email, mdp: hashedMdp, type });

    const userObj = created.toObject();
    delete userObj.mdp;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userObj
    });
  } catch (err) {
    next(err);
  }
};