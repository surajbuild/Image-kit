import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string;
    password?: string;
    provider: "credentials" | "google" | "github";
    image?: string;
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
        },
        provider: {
            type: String,
            enum: ['credentials', 'google', 'github'],
            default: 'credentials',
        },
        image: {
            type: String,
        },
    },
    {timestamps: true}
);

UserSchema.pre('save', async function () {
    if( !this.password || !this.isModified('password')){
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

const User = models?.User || model<IUser>("User", UserSchema)

export default User