const mongoose = require('mongoose');

let cachedConnection = null;
let connectionPromise = null;

// Reuse the same MongoDB connection across local restarts and serverless invocations.
const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not set');
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGO_URI)
            .then((conn) => {
                cachedConnection = conn;
                console.log(`MongoDB Connected : ${conn.connection.host}`);
                return conn;
            })
            .catch((error) => {
                connectionPromise = null;
                throw error;
            });
    }

    return connectionPromise;
};

module.exports = connectDB;
