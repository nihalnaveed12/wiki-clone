import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMediaVideo {
  title?: string;
  type?: string;
  embedUrl?: string;
  isFeatured?: boolean;
}

export interface IDefiningTrack {
  title?: string;
  year?: number;
  image?: {
    id?: string;
    url?: string;
  };
  externalLink?: string;
}

export interface IAffiliation {
  name?: string;
  link?: string;
}

export interface IRapper extends Document {
  name: string;
  city: string;
  state?: string;
  lat: number;
  lng: number;
  category: string;
  artistStatus?: string;
  website?: string;

  // Socials (twitter already existed; adding appleMusic explicitly)
  socials: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    soundcloud?: string;
    twitter?: string;
    appleMusic?: string;
  };

  // Hero section
  heroBannerImage?: {
    id?: string;
    url?: string;
  };
  heroTags?: string[];
  // NOTE: twitter moved earlier into socials, appleMusic added there as well

  image: {
    id: string;
    url: string;
  };

  shortBio: string;
  audio?: string;

  // Media Hub (array of videos)
  videos?: IMediaVideo[];

  // Defining tracks (array)
  definingTracks?: IDefiningTrack[];

  // Deep dive (rich text)
  deepDiveNarrative?: any; // rich text - store as HTML/Delta/JSON. Use Mixed.

  // At-a-glance details
  alsoKnownAs?: string[];
  born?: string; // keep as string for flexibility ("1990-05-12" or "May 1990" etc.)
  origin?: string;
  primaryAffiliation?: IAffiliation;
  notableCollaborators?: string[];
  proteges?: string[];

  // Related artists: store as object ids referencing same collection
  relatedArtists?: string[];

  // Legacy / existing fields (kept unless requested to remove)
  readMoreLink?: string;
  yearsActive?: {
    start?: number | null;
    end?: number | null;
  };
  status: 'active' | 'inactive';
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
  createdAt?: Date;
  updatedAt?: Date;
}

const RapperSchema = new Schema<IRapper>(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, default: '', trim: true },
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
      appleMusic: { type: String, default: '' },
    },

    // Hero section
    heroBannerImage: {
      id: { type: String, default: '' },
      url: { type: String, default: '' },
    },
    heroTags: { type: [String], default: [] },

    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },

    shortBio: { type: String, required: true, trim: true, maxlength: 500 },
    audio: { type: String, default: '' },

    // Media hub videos
    videos: {
      type: [
        {
          title: { type: String, default: '' },
          type: { type: String, default: '' }, // e.g., 'youtube', 'vimeo', 'live'
          embedUrl: { type: String, default: '' },
          isFeatured: { type: Boolean, default: false },
        },
      ],
      default: [],
    },

    // Defining tracks
    definingTracks: {
      type: [
        {
          title: { type: String, default: '' },
          year: { type: Number, default: null },
          image: {
            id: { type: String, default: '' },
            url: { type: String, default: '' },
          },
          externalLink: { type: String, default: '' },
        },
      ],
      default: [],
    },

    // Deep dive narrative - rich text: using Mixed to allow HTML / Quill Delta / JSON
    deepDiveNarrative: { type: Schema.Types.Mixed, default: '' },

    // At-a-glance
    alsoKnownAs: { type: [String], default: [] },
    born: { type: String, default: '' }, // string for flexible formats
    origin: { type: String, default: '' },
    primaryAffiliation: {
      name: { type: String, default: '' },
      link: { type: String, default: '' },
    },
    notableCollaborators: { type: [String], default: [] },
    proteges: { type: [String], default: [] },

    // Related artists as references
    relatedArtists: { type: [String] , default: [] },

    // Kept existing fields (not removed from DB to avoid breaking existing data)
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
  },
  { timestamps: true }
);

const Rapper = mongoose.models.Rapper || mongoose.model<IRapper>('Rapper', RapperSchema);

export default Rapper;
