import mongoose, { Schema, Document } from 'mongoose';

export interface IRapper extends Document {
    name: string;
    city: string;
    lat: number;
    lng: number;
    category: string;
    artistStatus?: string;
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
    tags: string[];
    readMoreLink?: string;
    yearsActive: {
        start?: number;
        end?: number;
    };
    status: 'active' | 'inactive';
    labelCrew?: string;
    labelCrewLink?: string;
    associatedActs?: string[];
    associatedActsLinks?: string[];
    district?: string;
    districtLink?: string;
    frequentProducers: string[];
    frequentProducersLink: string[];
    breakoutTrack: {
        name?: string;
        url?: string;
    };
    definingProject: {
        name?: string;
        year?: number;
        link?: string;
    };
    fansOf?: string[];
    fansOfLink?: string[];
    submittedBy: string;
    createdAt: Date;
    updatedAt: Date;

    // New fields for YouTube embed
    videoEmbed?: string;
    videoWidth?: number;
    videoHeight?: number;
}

const RapperSchema = new Schema<IRapper>(
    {
        name: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        category: { type: String, required: true, trim: true },
        artistStatus: { type: String, trim: true },
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
        tags: { type: [String], default: [] },
        readMoreLink: { type: String, default: '' },
        yearsActive: {
            start: { type: Number, default: null },
            end: { type: Number, default: null },
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        labelCrew: { type: String, default: '' },
        labelCrewLink: { type: String, default: '' },
        associatedActs: { type: [String], default: [] },
        associatedActsLinks: { type: [String], default: [] },
        district: { type: String, default: '' },
        districtLink: { type: String, default: '' },
        frequentProducers: { type: [String], default: [] },
        frequentProducersLink: { type: [String], default: [] },
        breakoutTrack: {
            name: { type: String, default: '' },
            url: { type: String, default: '' },
        },
        definingProject: {
            name: { type: String, default: '' },
            year: { type: Number, default: null },
            link: { type: String, default: '' },
        },
        fansOf: { type: [String], default: [] },
        fansOfLink: { type: [String], default: [] },
        submittedBy: { type: String, default: '' },

        // NEW FIELDS
        videoEmbed: { type: String, default: '' },
        videoWidth: { type: Number, default: 560 },
        videoHeight: { type: Number, default: 315 },
    },
    { timestamps: true }
);

const Rapper =
    mongoose.models.Rapper || mongoose.model<IRapper>('Rapper', RapperSchema);

export default Rapper;
