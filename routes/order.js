const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

// Récupérer les commandes d'un utilisateur
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { items, total, paymentResult } = req.body;

  console.log("Received data:", { userId, items, total, paymentResult }); // Debugging line

  try {
    const order = new Order({ userId, items, total, paymentResult });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("Error saving order:", err); // Debugging line

    // Ajout de plus de détails sur l'erreur
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: 'Validation Error', details: err.errors });
    } else if (err.name === 'MongoError') {
      res.status(500).json({ error: 'Database Error', details: err.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  }
});


module.exports = router;
