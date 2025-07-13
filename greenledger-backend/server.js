const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

app.use(express.json());


// Connect to MongoDB (update the URI if needed)
mongoose.connect('mongodb://localhost:27017/greenledger')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));
// Define Mongoose Product schema/model
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  quantity: Number,
  expiryDate: Date
});
const Product = mongoose.model('Product', productSchema);



  
// Mock predictive analytics endpoint

// Endpoint to seed 50 mock products
app.post('/api/seed-products', async (req, res) => {
  try {
    // Remove existing products
    await Product.deleteMany({});
    // Mock categories
    const categories = ['Dairy', 'Produce', 'Bakery', 'Meat & Seafood', 'Packaged Goods'];
    // Generate 50 mock products
    const products = Array.from({ length: 50 }, (_, i) => ({
      name: `Product ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: parseFloat((Math.random() * 100).toFixed(2)),
      quantity: Math.floor(Math.random() * 100) + 1,
      expiryDate: new Date(Date.now() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000)
    }));
    await Product.insertMany(products);
    res.json({ message: 'Seeded 50 mock products!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mock predictive analytics endpoint
// Real predictive analytics endpoint (aggregates inventory by category)
app.get('/api/predict-inventory', async (req, res) => {
  try {
    const prediction = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          units: { $sum: "$quantity" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          units: 1
        }
      }
    ]);
    res.json({ prediction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(4000, () => console.log('Backend running on http://localhost:4000'));