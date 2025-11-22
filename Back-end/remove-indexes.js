const mongoose = require('mongoose');
const CONFIG = require('./config/config');

// Connect to MongoDB
mongoose.connect(CONFIG.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
    console.log('Connected to MongoDB');

    try {
        // Drop the unique index from sponsors collection
        const sponsorsCollection = db.collection(CONFIG.mongodb.collections.sponsor);
        await sponsorsCollection.dropIndex('auth.username_1');
        console.log('✓ Removed unique index from sponsors collection');
    } catch (error) {
        console.log('Sponsors index not found or already removed:', error.message);
    }

    try {
        // Drop the unique index from experts collection
        const expertsCollection = db.collection(CONFIG.mongodb.collections.expert);

        // Try to remove auth.username_1 index
        try {
            await expertsCollection.dropIndex('auth.username_1');
            console.log('✓ Removed auth.username_1 index from experts collection');
        } catch (err) {
            console.log('  auth.username_1 not found:', err.message);
        }

        // Try to remove auth.expertname_1 index (old schema)
        try {
            await expertsCollection.dropIndex('auth.expertname_1');
            console.log('✓ Removed auth.expertname_1 index from experts collection');
        } catch (err) {
            console.log('  auth.expertname_1 not found:', err.message);
        }
    } catch (error) {
        console.log('Error with experts collection:', error.message);
    }

    console.log('\nDone! You can now start the server.');
    process.exit(0);
});
