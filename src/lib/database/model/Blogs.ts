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
    // Additional biographical fields
    bornDate: string;
    bornPlace: string;
    diedDate: string;
    diedPlace: string;
    occupation: string;
    spouses: string;
    // New YouTube video URL field
    youtubeUrl: string;
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
        // Additional biographical fields
        bornDate: {
            type: String,
            default: '',
            trim: true,
        },
        bornPlace: {
            type: String,
            default: '',
            trim: true,
        },
        diedDate: {
            type: String,
            default: '',
            trim: true,
        },
        diedPlace: {
            type: String,
            default: '',
            trim: true,
        },
        occupation: {
            type: String,
            default: '',
            trim: true,
        },
        spouses: {
            type: String,
            default: '',
            trim: true,
        },
        // New YouTube video URL field
        youtubeUrl: {
            type: String,
            default: '',
            trim: true,
            validate: {
                validator: function (v: string) {
                    // If empty, it's valid (optional field)
                    if (!v || v.trim() === '') return true;

                    // Validate YouTube URL format
                    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
                    return youtubeRegex.test(v);
                },
                message: 'Please provide a valid YouTube URL'
            }
        },
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
BlogSchema.index({ occupation: 1 });

const Blog = mongoose.models?.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;