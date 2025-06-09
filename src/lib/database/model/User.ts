import mongoose, { Document, Schema } from 'mongoose';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;

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
    isAdmin(): boolean;
    updateRoleIfAdmin(): Promise<IUser>;
}

const UserSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true,
        unique: true,
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

// Method to check if user is admin
UserSchema.methods.isAdmin = function (): boolean {
    return this.role === 'admin' || this.email === ADMIN_EMAIL;
};

// Method to update role if user has admin email
UserSchema.methods.updateRoleIfAdmin = async function (this: typeof UserSchema['methods']): Promise<typeof this> {
    if (this.email === ADMIN_EMAIL && this.role !== 'admin') {
        this.role = 'admin';
        await this.save();
    }
    return this;
};

// Pre-save middleware to automatically set admin role based on email
UserSchema.pre('save', function (next) {
    if (this.email === ADMIN_EMAIL && this.role !== 'admin') {
        this.role = 'admin';
    }
    next();
});

// Static method to check if email is admin email
UserSchema.statics.isAdminEmail = function (email: string): boolean {
    return email === ADMIN_EMAIL;
};

// Create indexes for better performance
UserSchema.index({ role: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;