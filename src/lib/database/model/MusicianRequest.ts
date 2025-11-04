import mongoose, { Schema, Document } from 'mongoose';

export interface IMusicianRequest extends Document {
    name: string;
    city: string;
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
    status: 'pending' | 'approved' | 'rejected';
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
    submittedBy?: string;
    reviewedBy?: string;
    reviewedAt?: Date;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;

    // New fields for YouTube embed
    videoEmbed?: string;
    videoWidth?: number;
    videoHeight?: number;
}

const MusicianRequestSchema = new Schema<IMusicianRequest>(
    {
        name: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
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
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
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
            link: { type: String, default: '' },
            year: { type: Number, default: null },
        },
        fansOf: { type: [String], default: [] },
        fansOfLink: { type: [String], default: [] },
        submittedBy: { type: String, default: '' },
        reviewedBy: { type: String, default: '' },
        reviewedAt: { type: Date },
        rejectionReason: { type: String, default: '' },

        // NEW FIELDS
        videoEmbed: { type: String, default: '' },
        videoWidth: { type: Number, default: 560 },
        videoHeight: { type: Number, default: 315 },
    },
    { timestamps: true }
);

const MusicianRequest =
    mongoose.models.MusicianRequest ||
    mongoose.model<IMusicianRequest>('MusicianRequest', MusicianRequestSchema);

export default MusicianRequest;
