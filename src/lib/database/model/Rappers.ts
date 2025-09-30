// @/lib/database/model/Rappers.ts (Updated)

import mongoose, { Schema, Document } from 'mongoose';

export interface IRapper extends Document {
    name: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    category: string;
    website?: string;
    socials: {
        instagram?: string;
        youtube?: string;
        spotify?: string;
        soundcloud?: string;
        twitter?: string;
    };
    image: {
        id: string;
        url: string;
    };
    shortBio: string;
    audio?: string;  // 🎶 Added
    submittedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

const RapperSchema = new Schema<IRapper>(
    {
        name: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        category: { type: String, required: true, trim: true },
        website: { type: String, default: '' },
        socials: {
            instagram: { type: String, default: '' },
            youtube: { type: String, default: '' },
            spotify: { type: String, default: '' },
            soundcloud: { type: String, default: '' },
            twitter: { type: String, default: '' },
        },
        image: {
            id: { type: String, required: true },
            url: { type: String, required: true },
        },
        shortBio: { type: String, required: true, trim: true, maxlength: 500 },
        audio: { type: String, default: '' },   // 🎶 Added
        submittedBy: { type: String, default: '' },
    },
    { timestamps: true }
);

const Rapper = mongoose.models.Rapper || mongoose.model<IRapper>('Rapper', RapperSchema);

export default Rapper;
