require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const clientsModel = require('./models/clients');
const orderRoutes = require('./routes/order');
const bcrypt = require('bcrypt'); // For password hashing

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Environment Variables
const mongoUri = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

// MongoDB Connection with Retry Mechanism
const connectToMongoDB = async (retries = 5) => {
  while (retries) {
    try {
      console.log("Attempting to connect to MongoDB...");
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.info("Connected to MongoDB Atlas successfully");
      break; // Exit loop once connected
    } catch (err) {
      console.error(`Error connecting to MongoDB: ${err.message}`);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }
  if (!retries) process.exit(1); // Exit if unable to connect
};

connectToMongoDB();

// Routes for user login and register
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await clientsModel.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        res.json({ name: user.name, userId: user._id });
      } else {
        res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      res.status(404).json({ error: "No user found with this email" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = await clientsModel.create({
      name,
      email,
      password: hashedPassword, // Save the hashed password
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes for orders
app.use('/orders', orderRoutes);

// Test routes
app.get('/', (req, res) => {
  res.send('Hello backend from express');
});

app.get('/hy', (req, res) => {
  res.send('hy friends');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running well on port ${PORT}`);
});
