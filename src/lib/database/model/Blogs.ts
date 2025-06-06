// models/Blog.ts (Updated)
import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    content: string;
    image: {
        id: string;
        url: string;
    };
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
                default: '',
            },
            url: {
                type: String,
                default: '',
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
        tags: [{
            type: String,
            trim: true,
        }],
    },
    {
        timestamps: true,
    }
);

// for bht achi performanceeeee
BlogSchema.index({ author: 1 });
BlogSchema.index({ published: 1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ tags: 1 });

const Blog = mongoose.models?.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;