const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const User = require('./models/User');
const setupSwagger = require('./swagger');

const app = express();
const PORT = 3000;

connectDB();

app.use(cors());
app.use(bodyParser.json());
try{
    setupSwagger(app);
}catch(e){
    console.error(e);
}
/**
 * @description Création d'un utilisateur
 * @route POST /api/users
 * @swagger
 * /api/users:
 *   post:
 *     summary: Création d'un utilisateur
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *               ville:
 *                 type: string
 *               codePostal:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       500:
 *         description: Une erreur est survenue lors de l'inscription.
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
 * @description Connexion d'un utilisateur
 * @route POST /api/login
 * @swagger
 * /api/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Email ou mot de passe incorrect.
 *       500:
 *         description: Une erreur est survenue lors de la connexion.
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
 * @description Récupération de tous les utilisateurs
 * @route GET /api/users
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Utilisateurs
 *     summary: Récupération de tous les utilisateurs
 *     responses:
 *       200:
 *         description: Succès
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
 * @description Suppression d'un utilisateur par son id
 * @route DELETE /api/users/{id}
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Suppression d'un utilisateur par son id
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Une erreur est survenue lors de la suppression de l'utilisateur.
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