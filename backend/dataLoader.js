
// //helps us to use .env file secrets and avoid harcoding password
// require('dotenv').config();

// const mongoose = require('mongoose');

// // load models
// const QuarterlyRevenue = require('./models/QuarterlyRevenue');
// // Do the same for other models

// //load data
// const quarterlyData = require('/Users/somyaagarwal/Downloads/json/A._Quarterly_Revenue_and_QoQ_growth.json');
// // Do the same for other JSONs


// mongoose.connect(process.env.MONGO_URI)
//   .then(async () => {
//     console.log('Connected to MongoDB');

//     await QuarterlyRevenue.deleteMany({});
//     await QuarterlyRevenue.insertMany(quarterlyData);
//     console.log('QuarterlyRevenue loaded');
//     // Repeat for other JSON files

//     mongoose.disconnect();
//   })
// .catch((err) => console.error('Data Load Error:', err));