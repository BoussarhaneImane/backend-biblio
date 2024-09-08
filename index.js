require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const clientsModel = require('./models/clients');
const orderRoutes = require('./routes/order'); // Import des routes de commandes

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Variables d'environnement
const mongoUri = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
const connectToMongoDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    });
    console.info("Connected to MongoDB Atlas successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

connectToMongoDB();

// Routes pour les utilisateurs (login, register)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await clientsModel.findOne({ email });
    if (user) {
      if (user.password === password) {
        res.json({ name: user.name, userId: user._id }); // Inclure l'userId dans la réponse
      } else {
        res.status(401).json({ error: "The password is incorrect, ops!" });
      }
    } else {
      res.status(404).json({ error: "No record existed" });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/register', async (req, res) => {
  try {
    const client = await clientsModel.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Routes pour les commandes
app.use('/orders', orderRoutes); // Utiliser les routes définies pour les commandes

// Routes de test
app.get('/', (req, res) => {
  res.send('Hello backend from express by imane');
});

app.get('/hy', (req, res) => {
  res.send('hy friends');
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server running well on port ${PORT}`);
});
