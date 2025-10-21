import mongoose, { Schema, Document } from 'mongoose';

export interface IRapper extends Document {
    name: string;
    city: string;
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
    audio?: string;
    tags: string[]; // Genres/Tags
    readMoreLink?: string;
    yearsActive: {
        start: number;
        end?: number; // null if still active
    };
    status: 'active' | 'inactive';
    labelCrew?: string;
    associatedActs: string[]; // Array of act names
    district?: string;
    frequentProducers: string[]; // Array of producer names
    breakoutTrack: {
        name: string;
        url?: string;
    };
    definingProject: {
        name: string;
        year?: number;
    };
    fansOf: string[]; // Array of artists they're fans of
    submittedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

const RapperSchema = new Schema<IRapper>(
    {
        name: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
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
        audio: { type: String, default: '' },
        tags: {
            type: [String],
            default: [],
        },
        readMoreLink: { type: String, default: '' },
        yearsActive: {
            start: { type: Number, required: true },
            end: { type: Number, default: null },
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        labelCrew: { type: String, default: '' },
        associatedActs: {
            type: [String],
            default: [],
        },
        district: { type: String, default: '' },
        frequentProducers: {
            type: [String],
            default: [],
        },
        breakoutTrack: {
            name: { type: String, required: true },
            url: { type: String, default: '' },
        },
        definingProject: {
            name: { type: String, required: true },
            year: { type: Number, default: null },
        },
        fansOf: {
            type: [String],
            default: [],
        },
        submittedBy: { type: String, default: '' },
    },
    { timestamps: true }
);

const Rapper = mongoose.models.Rapper || mongoose.model<IRapper>('Rapper', RapperSchema);

export default Rapper;