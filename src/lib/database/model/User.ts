// models/User.ts (Updated with role field)
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    photo?: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true,
        unique: true, // Prevents duplicates
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

// Create indexes for better performance
UserSchema.index({ role: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;