import dbConnect from '@/lib/database/mongodb';
import User from '@/lib/database/model/User';

interface CreateUserParams {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    photo?: string;
}

interface UpdateUserParams {
    clerkId: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    photo?: string;
}

export async function getAllUsers() {
    try {
        await dbConnect();

        const users = await User.find({});

        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}


export async function createUser(userData: CreateUserParams) {
    try {
        await dbConnect();

        // Use upsert to avoid duplicates - creates if doesn't exist, updates if exists
        const user = await User.findOneAndUpdate(
            { clerkId: userData.clerkId }, // Find by clerkId
            {
                $set: {
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    username: userData.username,
                    photo: userData.photo,
                }
            },
            {
                upsert: true, // Create if doesn't exist
                new: true,    // Return updated document
                runValidators: true
            }
        );

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error('Error creating/updating user:', error);
        throw error;
    }
}

export async function updateUser(userData: UpdateUserParams) {
    try {
        await dbConnect();

        const updatedUser = await User.findOneAndUpdate(
            { clerkId: userData.clerkId },
            {
                $set: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    username: userData.username,
                    photo: userData.photo,
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error('User not found');
        }

        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export async function deleteUser(clerkId: string) {
    try {
        await dbConnect();

        const deletedUser = await User.findOneAndDelete({ clerkId });

        if (!deletedUser) {
            throw new Error('User not found');
        }

        return JSON.parse(JSON.stringify(deletedUser));
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

export async function getUserByClerkId(clerkId: string) {
    try {
        await dbConnect();

        const user = await User.findOne({ clerkId });

        return user ? JSON.parse(JSON.stringify(user)) : null;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}