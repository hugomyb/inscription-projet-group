const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connecté à la base de données MongoDB.');

        const User = require('./models/User');
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        if (!adminExists) {
            const admin = new User({
                nom: 'Admin',
                prenom: 'Utilisateur',
                email: 'loise.fenoll@ynov.com',
                password: 'ANKymoUTFu4rbybmQ9Mt',
                role: 'admin',
            });
            await admin.save();
            console.log('Utilisateur admin créé.');
        }
    } catch (err) {
        console.error('Erreur lors de la connexion à MongoDB :', err);
        process.exit(1);
    }
};

module.exports = connectDB;
