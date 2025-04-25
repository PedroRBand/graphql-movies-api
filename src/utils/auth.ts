import jwt from "jsonwebtoken"
import { Request } from "express"
import UserModel, { IUser } from "../models/userModel.js"

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'itdidntwork'

export const generateToken = (user: IUser) => {
    return jwt.sign(
        {id: user._id, username: user.username, role: user.role},
        TOKEN_SECRET,
        {expiresIn: '7d'}
    )
}

export const getUserFromToken = async (req: Request) => {
    const auth = req.headers.authorization
    if(!auth || !auth.startsWith('Bearer ')) return null

    const token = auth.split(' ')[1]

    try{
        const decoded = jwt.verify(token, TOKEN_SECRET) as {id: string}
        const user = await UserModel.findById(decoded.id)
        return user
    } catch (err) {
        return 'Could not find user.'
    }
}