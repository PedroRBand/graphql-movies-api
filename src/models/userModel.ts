import mongoose from "mongoose"
import bcrypt from "bcryptjs"

interface IUser extends Document {
    username: string,
    password: string,
    comparePassword: (userPassword: string) => Promise<boolean>,
    role: string,
}

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, default: 'guest'},
})

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = function (userPassword: string) {
    return bcrypt.compare(userPassword, this.password)
}

const UserModel = mongoose.model<IUser>('User', userSchema)
export default UserModel