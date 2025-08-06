import mongoose, { Schema, Document } from 'mongoose';

export interface IRapper extends Document {
    name: string;
    city: string;
    lat: number;
    lng: number;
    category: string;
    socials: {
        instagram?: string;
        twitter?: string;
        youtube?: string;
        spotify?: string;
    };
    image: {
        id: string;
        url: string;
    };
    shortBio: string;
    createdAt: Date;
    updatedAt: Date;
}

const RapperSchema = new Schema<IRapper>(
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
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        socials: {
            instagram: {
                type: String,
                default: '',
            },
            twitter: {
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
    },
    {
        timestamps: true,
    }
)

const Rapper = mongoose.model<IRapper>('Rapper', RapperSchema);
export default Rapper;