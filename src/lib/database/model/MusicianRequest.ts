import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMusicianRequest extends Document {
  name: string;
  city: string;
  state?: string;
  lat?: number;
  lng?: number;
  category: string;
  artistStatus?: string;
  website?: string;
  socials: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    soundcloud?: string;
    twitter?: string;
    appleMusic?: string;
  };
  heroBannerImage?: {
    id?: string;
    url?: string;
  };
  heroTags?: string[];
  image: {
    id: string;
    url: string;
  };
  shortBio: string;
  audio?: string;
  videos?: {
    title?: string;
    type?: string;
    embedUrl?: string;
    isFeatured?: boolean;
  }[];
  definingTracks?: {
    title?: string;
    year?: number;
    image?: {
      id?: string;
      url?: string;
    };
    externalLink?: string;
  }[];
  deepDiveNarrative?: any; // rich text
  alsoKnownAs?: string[];
  born?: string;
  origin?: string;
  primaryAffiliation?: {
    name?: string;
    link?: string;
  };
  notableCollaborators?: string[];
  proteges?: string[];
  relatedArtists?: string[];

  readMoreLink?: string;
  yearsActive?: {
    start?: number;
    end?: number;
  };
  status: "pending" | "approved" | "rejected";
  labelCrew?: string;
  labelCrewLink?: string;
  associatedActs?: string[];
  associatedActsLinks?: string[];
  district?: string;
  districtLink?: string;
  frequentProducers?: string[];
  frequentProducersLink?: string[];
  breakoutTrack?: {
    name?: string;
    url?: string;
  };
  definingProject?: {
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
  createdAt?: Date;
  updatedAt?: Date;
}

const MusicianRequestSchema = new Schema<IMusicianRequest>(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, default: "", trim: true },
    lat: { type: Number },
    lng: { type: Number },
    category: { type: String, required: true, trim: true },
    artistStatus: { type: String, trim: true },
    website: { type: String, default: "" },

    socials: {
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      spotify: { type: String, default: "" },
      soundcloud: { type: String, default: "" },
      twitter: { type: String, default: "" },
      appleMusic: { type: String, default: "" },
    },

    heroBannerImage: {
      id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    heroTags: { type: [String], default: [] },

    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    shortBio: { type: String, required: true, trim: true, maxlength: 500 },
    audio: { type: String, default: "" },

    videos: {
      type: [
        {
          title: { type: String, default: "" },
          type: { type: String, default: "" },
          embedUrl: { type: String, default: "" },
          isFeatured: { type: Boolean, default: false },
        },
      ],
      default: [],
    },

    definingTracks: {
      type: [
        {
          title: { type: String, default: "" },
          year: { type: Number, default: null },
          image: {
            id: { type: String, default: "" },
            url: { type: String, default: "" },
          },
          externalLink: { type: String, default: "" },
        },
      ],
      default: [],
    },

    deepDiveNarrative: { type: Schema.Types.Mixed, default: "" },
    alsoKnownAs: { type: [String], default: [] },
    born: { type: String, default: "" },
    origin: { type: String, default: "" },
    primaryAffiliation: {
      name: { type: String, default: "" },
      link: { type: String, default: "" },
    },
    notableCollaborators: { type: [String], default: [] },
    proteges: { type: [String], default: [] },
    relatedArtists: {
      type: [String],
      
      default: [],
    },

    readMoreLink: { type: String, default: "" },
    yearsActive: {
      start: { type: Number, default: null },
      end: { type: Number, default: null },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    labelCrew: { type: String, default: "" },
    labelCrewLink: { type: String, default: "" },
    associatedActs: { type: [String], default: [] },
    associatedActsLinks: { type: [String], default: [] },
    district: { type: String, default: "" },
    districtLink: { type: String, default: "" },
    frequentProducers: { type: [String], default: [] },
    frequentProducersLink: { type: [String], default: [] },
    breakoutTrack: {
      name: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    definingProject: {
      name: { type: String, default: "" },
      link: { type: String, default: "" },
      year: { type: Number, default: null },
    },
    fansOf: { type: [String], default: [] },
    fansOfLink: { type: [String], default: [] },
    submittedBy: { type: String, default: "" },
    reviewedBy: { type: String, default: "" },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

const MusicianRequest =
  mongoose.models.MusicianRequest ||
  mongoose.model<IMusicianRequest>("MusicianRequest", MusicianRequestSchema);

export default MusicianRequest;
