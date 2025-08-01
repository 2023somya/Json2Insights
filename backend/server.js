//imports the Express.js library
const express = require('express');
const mongoose = require('mongoose');

//helps to establish connection bw frontend and backend
const cors = require('cors');

require('dotenv').config();

//creates your Express app — the actual web server.
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());


// Test route
app.get('/health-check', (req, res) => {
    console.log('/health-check route HIT');
  res.send('API is running');
});

// Revenue routes 
app.use('/api/v1/revenue', require('./routes/revenueRoutes'));
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/v1/ai', aiRoutes);


//mongoose is a object document mapper that maps json object with mongodb document
console.log('Connecting to MongoDB with URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// if connection successfull
.then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
})

// if error connecting with db, then
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
});