// lib/utils/admin.ts
import User from '@/lib/database/model/User';
import dbConnect from '@/lib/database/mongodb';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
const MAX_ADMINS = 3;

/**
 * Check if a user is an admin by their Clerk ID
 */
export async function isUserAdmin(clerkId: string): Promise<boolean> {
    try {
        await dbConnect();
        const user = await User.findOne({ clerkId });
        return user?.email === ADMIN_EMAIL || user?.role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

/**
 * Update user role to admin if they have the admin email
 */
export async function updateUserRoleIfAdmin(clerkId: string): Promise<void> {
    try {
        await dbConnect();
        const user = await User.findOne({ clerkId });
        if (user && user.email === ADMIN_EMAIL && user.role !== 'admin') {
            await User.findByIdAndUpdate(user._id, { role: 'admin' });
        }
    } catch (error) {
        console.error('Error updating user role:', error);
    }
}

/**
 * Get current admin count
 */
export async function getAdminCount(): Promise<number> {
    try {
        await dbConnect();
        return await User.countDocuments({ role: 'admin' });
    } catch (error) {
        console.error('Error getting admin count:', error);
        return 0;
    }
}

/**
 * Check if more admins can be added
 */
export async function canAddMoreAdmins(): Promise<boolean> {
    const adminCount = await getAdminCount();
    return adminCount < MAX_ADMINS;
}

/**
 * Admin user type for getAllAdmins
 */
export interface AdminUser {
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    clerkId: string;
    createdAt: Date;
    _id?: string;
}

/**
 * Get all admins
 */
export async function getAllAdmins(): Promise<AdminUser[]> {
    try {
        await dbConnect();
        return await User.find({ role: 'admin' })
            .select('firstName lastName email photo clerkId createdAt')
            .sort({ createdAt: -1 }) as AdminUser[];
    } catch (error) {
        console.error('Error getting all admins:', error);
        return [];
    }
}

/**
 * Promote user to admin with validation
 */
export async function promoteUserToAdmin(userId: string, currentAdminClerkId: string): Promise<{
    success: boolean;
    message: string;
    user?: AdminUser;
}> {
    try {
        await dbConnect();

        // Check if current user is admin
        const isCurrentUserAdmin = await isUserAdmin(currentAdminClerkId);
        if (!isCurrentUserAdmin) {
            return { success: false, message: 'Only admins can promote users' };
        }

        // Check if we can add more admins
        const canAdd = await canAddMoreAdmins();
        if (!canAdd) {
            return { success: false, message: `Maximum of ${MAX_ADMINS} admins allowed` };
        }

        // Find target user
        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return { success: false, message: 'User not found' };
        }

        if (targetUser.role === 'admin') {
            return { success: false, message: 'User is already an admin' };
        }

        // Update user role
        targetUser.role = 'admin';
        await targetUser.save();

        return {
            success: true,
            message: 'User promoted to admin successfully',
            user: {
                firstName: targetUser.firstName ?? '',
                lastName: targetUser.lastName ?? '',
                email: targetUser.email ?? '',
                photo: targetUser.photo,
                clerkId: targetUser.clerkId ?? '',
                createdAt: targetUser.createdAt,
                _id: targetUser._id?.toString()
            }
        };
    } catch (error) {
        console.error('Error promoting user to admin:', error);
        return { success: false, message: 'Error promoting user to admin' };
    }
}

/**
 * Demote admin to user with validation
 */
export async function demoteAdminToUser(userId: string, currentAdminClerkId: string): Promise<{
    success: boolean;
    message: string;
    user?: AdminUser;
}> {
    try {
        await dbConnect();

        // Check if current user is admin
        const isCurrentUserAdmin = await isUserAdmin(currentAdminClerkId);
        if (!isCurrentUserAdmin) {
            return { success: false, message: 'Only admins can demote users' };
        }

        // Find target user
        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return { success: false, message: 'User not found' };
        }

        if (targetUser.role !== 'admin') {
            return { success: false, message: 'User is not an admin' };
        }

        // Prevent demoting the main admin
        if (targetUser.email === ADMIN_EMAIL) {
            return { success: false, message: 'Cannot demote the main admin' };
        }

        // Update user role
        targetUser.role = 'user';
        await targetUser.save();

        return {
            success: true,
            message: 'Admin demoted to user successfully',
            user: {
                firstName: targetUser.firstName ?? '',
                lastName: targetUser.lastName ?? '',
                email: targetUser.email ?? '',
                photo: targetUser.photo,
                clerkId: targetUser.clerkId ?? '',
                createdAt: targetUser.createdAt,
                _id: targetUser._id?.toString()
            }
        };
    } catch (error) {
        console.error('Error demoting admin to user:', error);
        return { success: false, message: 'Error demoting admin to user' };
    }
}

/**
 * Check if user can delete a specific blog post
 */
export async function canDeleteBlogPost(blogId: string, userClerkId: string): Promise<{
    canDelete: boolean;
    reason?: string;
}> {
    try {
        await dbConnect();

        // Import Blog model here to avoid circular dependency
        const Blog = (await import('@/lib/database/model/Blogs')).default;

        const blog = await Blog.findById(blogId).populate('author');
        if (!blog) {
            return { canDelete: false, reason: 'Blog post not found' };
        }

        // Check if user is the author
        if (blog.author.clerkId === userClerkId) {
            return { canDelete: true };
        }

        // Check if user is admin
        const isAdmin = await isUserAdmin(userClerkId);
        if (isAdmin) {
            return { canDelete: true };
        }

        return { canDelete: false, reason: 'You can only delete your own posts' };
    } catch (error) {
        console.error('Error checking delete permissions:', error);
        return { canDelete: false, reason: 'Error checking permissions' };
    }
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminDashboardStats(): Promise<{
    totalUsers: number;
    totalAdmins: number;
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    canAddMoreAdmins: boolean;
}> {
    try {
        await dbConnect();

        // Import Blog model here to avoid circular dependency
        const Blog = (await import('@/lib/database/model/Blogs')).default;

        const [totalUsers, totalAdmins, totalBlogs, publishedBlogs] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'admin' }),
            Blog.countDocuments(),
            Blog.countDocuments({ published: true })
        ]);

        return {
            totalUsers,
            totalAdmins,
            totalBlogs,
            publishedBlogs,
            draftBlogs: totalBlogs - publishedBlogs,
            canAddMoreAdmins: totalAdmins < MAX_ADMINS
        };
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        return {
            totalUsers: 0,
            totalAdmins: 0,
            totalBlogs: 0,
            publishedBlogs: 0,
            draftBlogs: 0,
            canAddMoreAdmins: false
        };
    }
}