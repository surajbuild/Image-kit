import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string;
    password: string;
    _id?: Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

UserSchema.pre('save', async function () {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
});

const User = models?.User || model<IUser>("User", UserSchema)

export default User