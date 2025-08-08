import mongoose, { Schema, Document } from 'mongoose';

export interface IMusicianRequest extends Document {
    name: string;
    city: string;
    country: string;
    address: string;
    category: string;
    website?: string;
    socials: {
        instagram?: string;
        youtube?: string;
        spotify?: string;
        soundcloud?: string;
    };
    image: {
        id: string;
        url: string;
    };
    shortBio: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedBy?: string; // Optional: if you want to track who submitted
    reviewedBy?: string; // Optional: admin who reviewed
    reviewedAt?: Date;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MusicianRequestSchema = new Schema<IMusicianRequest>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        website: {
            type: String,
            default: '',
        },
        socials: {
            instagram: {
                type: String,
                default: '',
            },
            youtube: {
                type: String,
                default: '',
            },
            spotify: {
                type: String,
                default: '',
            },
            soundcloud: {
                type: String,
                default: '',
            },
        },
        image: {
            id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        shortBio: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        submittedBy: {
            type: String,
            default: '',
        },
        reviewedBy: {
            type: String,
            default: '',
        },
        reviewedAt: {
            type: Date,
        },
        rejectionReason: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const MusicianRequest = mongoose.models.MusicianRequest || mongoose.model<IMusicianRequest>('MusicianRequest', MusicianRequestSchema);

export default MusicianRequest;