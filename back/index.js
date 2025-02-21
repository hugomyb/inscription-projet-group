const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const User = require('./models/User');

const app = express();
const PORT = 3000;

connectDB();

app.use(cors());
app.use(bodyParser.json());

/**
 * Création d'un utilisateur
 */
app.post('/api/users', async (req, res) => {
    const { nom, prenom, email, password, dateNaissance, ville, codePostal } = req.body;

    try {
        const user = new User({
            nom,
            prenom,
            email,
            password,
            date_naissance: dateNaissance,
            ville,
            code_postal: codePostal,
        });
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès', userId: user._id });
    } catch (err) {
        console.error('Erreur lors de l\'insertion de l\'utilisateur :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'inscription.' });
    }
});

/**
 * Connexion d'un utilisateur
 */
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        res.status(200).json({ message: 'Connexion réussie', userId: user._id, role: user.role });
    } catch (err) {
        console.error('Erreur lors de la connexion :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la connexion.' });
    }
});

/**
 * Récupération de tous les utilisateurs
 */
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des utilisateurs.' });
    }
});

/**
 * Suppression d'un utilisateur par son id
 */
app.delete('/api/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }
        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'utilisateur.' });
    }
});

/**
 * Test de la connexion au serveur
 */
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
    console.log(`Le serveur backend est en cours d'exécution sur le port ${PORT}`);
});

const initializeAdminUser = async () => {
    try {
        const User = require('./models/User');
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        if (!adminExists) {
            const admin = new User({
                nom: 'Admin',
                prenom: 'Utilisateur',
                email: 'admin@example.com',
                password: 'adminpassword',
                role: 'admin',
            });
            await admin.save();
            console.log('Utilisateur admin créé.');
        } else {
            console.log('Utilisateur admin déjà existant.');
        }
    } catch (err) {
        console.error('Erreur lors de l\'initialisation de l\'utilisateur admin :', err);
    }
};

connectDB().then(() => {
    initializeAdminUser();
    app.listen(PORT, () => {
        console.log(`Le serveur backend est en cours d'exécution sur le port ${PORT}`);
    });
});