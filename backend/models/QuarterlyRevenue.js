//define the schema for the Quarterly Revenue data.

//imports mongoose library
const mongoose = require('mongoose');

//This line creates a schema, which is like a blueprint or template for each document (record) in your MongoDB collection.
const quarterlyRevenueSchema = new mongoose.Schema({
//   "Customer Name": String,
//   "Quarter 3 Revenue": Number,
//   "Quarter 4 Revenue": Number,
//   "Variance": Number,
//   "Percentage of Variance": Number

// the above gave error in rendering table because of extra spaces
  customerName: String,
  q3Revenue: Number,
  q4Revenue: Number,
  variance: Number,
  variancePercent: Number
});

//Makes this model named 'QuarterlyRevene' available for use in other files like dataLoader.js
module.exports = mongoose.model('QuarterlyRevenue', quarterlyRevenueSchema);