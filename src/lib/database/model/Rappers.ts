// @/lib/database/model/Rappers.ts (Updated)

import mongoose, { Schema, Document } from 'mongoose';

export interface IRapper extends Document {
    name: string;
    city: string;
    address: string; // <-- ADDED
    lat: number;
    lng: number;
    category: string;
    website?: string; // <-- ADDED
    socials: {
        instagram?: string;
        youtube?: string;
        spotify?: string;
        soundcloud?: string; // <-- ADDED
        twitter?: string; // This was in your original model, you can keep or remove it
    };
    image: {
        id: string;
        url: string;
    };
    shortBio: string;
    submittedBy: string;
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
        address: { // <-- ADDED
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
        website: { // <-- ADDED
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
            twitter: {
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
        submittedBy: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// To prevent Mongoose from recompiling the model
const Rapper = mongoose.models.Rapper || mongoose.model<IRapper>('Rapper', RapperSchema);

export default Rapper;