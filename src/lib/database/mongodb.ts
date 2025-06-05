import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Extend the global object to include mongoose
declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

type MongooseCache = { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null };

let cached: MongooseCache = global.mongoose as MongooseCache;

if (!cached) {
    cached = { conn: null, promise: null };
    global.mongoose = cached;
}

async function dbConnect() {
    if (cached?.conn) {
        return cached.conn;
    }

    if (!cached?.promise) {
        const opts: mongoose.ConnectOptions = {};
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;