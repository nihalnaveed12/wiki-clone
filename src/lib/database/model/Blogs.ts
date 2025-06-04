import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    content: string;
    image: string;
    author: mongoose.Types.ObjectId;
    slug: string;
    published: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        published: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.models?.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;