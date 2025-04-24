var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'itdidntwork';
export const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username, role: user.role }, TOKEN_SECRET, { expiresIn: '7d' });
};
export const getUserFromToken = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
        return null;
    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        const user = yield UserModel.findById(decoded.id);
        return user;
    }
    catch (err) {
        return 'Could not find user.';
    }
});
