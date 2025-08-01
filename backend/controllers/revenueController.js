const QuarterlyRevenue = require('../models/QuarterlyRevenue');

//gets total q3, q4, variance, top 10 customers
exports.getQuarterlySummary = async (req, res) => {
const expectedFields = [
    "Customer Name",
    "Quarter 3 Revenue",
    "Quarter 4 Revenue",
    "Variance",
    "Percentage of Variance"
  ];

    try{

        let matched = false;


        for (const file of global.uploadedFilesCache || []) {
      const jsonData = JSON.parse(file.buffer.toString());

      if (!Array.isArray(jsonData) || jsonData.length === 0) continue;

      const keysInFile = Object.keys(jsonData[0]);
      const hasAllFields = expectedFields.every(field => keysInFile.includes(field));

        if (hasAllFields) {
            console.log('if block entered');
            const cleanedData = jsonData.map(item => ({
                customerName: item["Customer Name"],
                q3Revenue: item["Quarter 3 Revenue"],
                q4Revenue: item["Quarter 4 Revenue"],
                variance: item["Variance"],
                variancePercent: item["Percentage of Variance"]
            }));

            const QuarterlyRevenue = require('../models/QuarterlyRevenue');
            await QuarterlyRevenue.deleteMany({});
            await QuarterlyRevenue.insertMany(cleanedData);
            matched = true;

            const totalQ3 = cleanedData.reduce((sum, item) => sum + item.q3Revenue, 0);
            const totalQ4 = cleanedData.reduce((sum, item) => sum + item.q4Revenue, 0);
            const totalVariance = cleanedData.reduce((sum, item) => sum + item.variance, 0);


            return res.status(200).json({
            message: 'Quarterly data processed',
            totalQ3,
            totalQ4,
            totalVariance,
            top10Customers: cleanedData
                .sort((a, b) => b.variance - a.variance)
                .slice(0, 10)
            });
            allCustomers: cleanedData
        }

        // //Fetches all records from the MongoDB collection quarterlyrevenues
        // const data = await QuarterlyRevenue.find();

        // //sums and replaces empty field with zero
        // const totalQ3 = data.reduce((sum, d) => sum + (d["Quarter 3 Revenue"] || 0), 0);

        // const totalQ4 = data.reduce((sum, d) => sum + (d["Quarter 4 Revenue"] || 0), 0);

        // const totalVariance = totalQ4 - totalQ3;

        // const top10 = data
        // //Keeps only records that have a Variance value (ignores null/missing)
        //     .filter(d => d.Variance != null)
        // //Sorts customers from highest to lowest revenue growth
        //     .sort((a, b) => b.Variance - a.Variance)
        // //Takes only the top 10 customers
        //     .slice(0, 10);
        // res.status(200).json({
        //     totalQ3,
        //     totalQ4,
        //     totalVariance,
        //     top10Customers: top10
        // });
    }


    if (!matched) {
      return res.status(400).json({ error: 'No matching JSON file for quarterly analysis.' });
    }
}
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating summary' });
    }
}

exports.getFilteredByQ4Revenue = async (req, res) =>{

    const expectedFields = [
    "Customer Name",
    "Quarter 3 Revenue",
    "Quarter 4 Revenue",
    "Variance",
    "Percentage of Variance"
  ];

  try{
    let matched = false;


        for (const file of global.uploadedFilesCache || []) {
        const jsonData = JSON.parse(file.buffer.toString());

        if (!Array.isArray(jsonData) || jsonData.length === 0) continue;

        const keysInFile = Object.keys(jsonData[0]);
        const hasAllFields = expectedFields.every(field => keysInFile.includes(field));

        if(hasAllFields){
            const threshold = parseFloat(req.query.q4);

            //check if input is num or not
            if (isNaN(threshold)) {
                return res.status(400).json({ error: 'Invalid Q4 threshold' });
            }

            try {
                //mongoose syntax to find >q4 entries
                const results = await QuarterlyRevenue.find({
                 q4Revenue: { $gt: threshold }
            }).select('-_id -__v');

            res.json(results);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Server error' });
            }
        }

        }

         if (!matched) {
      return res.status(400).json({ error: 'No matching JSON file for quarterly analysis.' });
    }

    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating table' });
    }


    
}

