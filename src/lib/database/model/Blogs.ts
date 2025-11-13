// /lib/models/blogs.ts
import mongoose, { Document, Schema } from "mongoose";

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

  // Old bio fields
  bornDate: string;
  bornPlace: string;
  diedDate: string;
  diedPlace: string;
  occupation: string;
  origin: string;
  sideSection: string;
  spouses: string;

  // New YouTube urls (up to 5)
  youtubeUrls: string[];
  musicVideos: string[];
  introVideos: string[];
  vlogVideos: string[];

  // New info-box fields
  alsoKnownAs: string;
  realName: string;
  genres: string[]; // stored as array
  associatedActs: string[]; // stored as array
  labels: string[]; // stored as array

  createdAt: Date;
  updatedAt: Date;
}

const youtubeRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[A-Za-z0-9_\-]{5,}(?:[?&][\w=&-]*)?$/;

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
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Old bio fields
    bornDate: {
      type: String,
      default: "",
      trim: true,
    },
    bornPlace: {
      type: String,
      default: "",
      trim: true,
    },
    diedDate: {
      type: String,
      default: "",
      trim: true,
    },
    diedPlace: {
      type: String,
      default: "",
      trim: true,
    },
    occupation: {
      type: String,
      default: "",
      trim: true,
    },
    spouses: {
      type: String,
      default: "",
      trim: true,
    },
    origin: {
      type: String,
      default: "",
      trim: true,
    },
    sideSection: {
      type: String,
      default: "",
      trim: true,
    },

    // New: youtubeUrls array (max 5). Each element validated by regex.
    youtubeUrls: {
      type: [String],
      default: [],
      validate: [
        {
          validator: function (arr: string[]) {
            // allow empty array; validate each non-empty entry
            if (!Array.isArray(arr)) return false;
            return arr.every((u) => {
              if (!u || typeof u !== "string") return false;
              const trimmed = u.trim();
              if (trimmed === "") return false; // don't store empty strings
              return youtubeRegex.test(trimmed);
            });
          },
          message: "One or more YouTube URLs are invalid.",
        },
      ],
    },

    musicVideos: {
      type: [String],
      default: [],
      validate: [
        {
          validator: function (arr: string[]) {
            // allow empty array; validate each non-empty entry
            if (!Array.isArray(arr)) return false;
            return arr.every((u) => {
              if (!u || typeof u !== "string") return false;
              const trimmed = u.trim();
              if (trimmed === "") return false; // don't store empty strings
              return youtubeRegex.test(trimmed);
            });
          },
        },
      ],
    },
    introVideos: {
      type: [String],
      default: [],
      validate: [
        {
          validator: function (arr: string[]) {
            // allow empty array; validate each non-empty entry
            if (!Array.isArray(arr)) return false;
            return arr.every((u) => {
              if (!u || typeof u !== "string") return false;
              const trimmed = u.trim();
              if (trimmed === "") return false; // don't store empty strings
              return youtubeRegex.test(trimmed);
            });
          },
        },
      ],
    },
    vlogVideos: {
      type: [String],
      default: [],
      validate: [
        {
          validator: function (arr: string[]) {
            // allow empty array; validate each non-empty entry
            if (!Array.isArray(arr)) return false;
            return arr.every((u) => {
              if (!u || typeof u !== "string") return false;
              const trimmed = u.trim();
              if (trimmed === "") return false; // don't store empty strings
              return youtubeRegex.test(trimmed);
            });
          },
        },
      ],
    },

    // New info-box fields
    alsoKnownAs: {
      type: String,
      default: "",
      trim: true,
    },
    realName: {
      type: String,
      default: "",
      trim: true,
    },
    genres: {
      type: [String],
      default: [],
    },
    associatedActs: {
      type: [String],
      default: [],
    },
    labels: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes
BlogSchema.index({ author: 1 });
BlogSchema.index({ published: 1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ occupation: 1 });

const Blog = mongoose.models?.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
