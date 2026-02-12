import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const client = new MongoClient(MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

/** @type {Promise<MongoClient> | null} */
let dbPromise = null;

/**
 * Connect to MongoDB and return the client.
 * Uses a singleton pattern to reuse the connection.
 */
export async function getDbClient() {
    if (!dbPromise) {
        dbPromise = client.connect();
        console.log('Connected to MongoDB');
    }
    return dbPromise;
}

/**
 * Get the 'specs' collection.
 */
export async function getSpecsCollection() {
    const client = await getDbClient();
    return client.db('task-gen').collection('specs');
}
