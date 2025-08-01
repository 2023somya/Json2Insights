import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const QuarterlyDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [inputThreshold, setInputThreshold] = useState('');
  const [threshold, setThreshold] = useState(null);
  const [showPositiveOnly, setShowPositiveOnly] = useState(false);

  const handleThresholdSubmit = () => {
    const value = parseFloat(inputThreshold);
    if (!isNaN(value)) {
      setThreshold(value);
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8085/api/v1/revenue/quarterly/summary')
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (threshold != null) {
      axios.get(`http://localhost:8085/api/v1/revenue/quarterly/filter?q4=${threshold}`)
        .then(res => {
          let data = res.data;
          if(showPositiveOnly){
            data = data.filter(item => item.variance > 0);
          }
          setTableData(data);
        })
        .catch(err => console.error(err));
    }
  }, [threshold, showPositiveOnly]);

  if (!summary) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <p>Loading dashboard data...</p>
    </div>
  );

  // Table styling
  const thStyle = {
    padding: '12px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#f5f7fa',
    fontWeight: '600',
    textAlign: 'center',
    color: '#333'
  };

  const tdStyle = {
    padding: '12px',
    border: '1px solid #e0e0e0',
    textAlign: 'center',
    backgroundColor: '#fff'
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Summary Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Quarterly Revenue Summary</h2>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0' }}><strong>Total Q3 Revenue:</strong> ₹{summary.totalQ3.toLocaleString()}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Total Q4 Revenue:</strong> ₹{summary.totalQ4.toLocaleString()}</p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0' }}><strong>Total Variance:</strong> ₹{summary.totalVariance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Top 10 Customers by Variance</h3>
        <div style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={summary.top10Customers}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="customerName" type="category" stroke="#666" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '10px'
                }}
              />
              <Bar dataKey="variance" fill="#4e73df" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Controls */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <label style={{ fontWeight: '500' }}>Filter customers with Q4 revenue above: </label>
          <input
            type="number"
            value={inputThreshold}
            onChange={(e) => setInputThreshold(e.target.value)}
            placeholder="Enter threshold"
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              flex: '1',
              maxWidth: '200px'
            }}
          />
          <button 
            onClick={handleThresholdSubmit}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4e73df',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#3a5bc7'
              }
            }}
          >
            Apply Filter
          </button>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={showPositiveOnly}
            onChange={(e) => setShowPositiveOnly(e.target.checked)}
          />
          Show positive variance only
        </label>
      </div>

      {/* Data Table */}
      <div style={{
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>📋 Detailed Customer Analysis</h3>
        <div style={{ overflowX: 'auto', maxHeight: '500px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Customer Name</th>
                <th style={thStyle}>Q3 Revenue</th>
                <th style={thStyle}>Q4 Revenue</th>
                <th style={thStyle}>Variance</th>
                <th style={thStyle}>Variance %</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{row.customerName}</td>
                  <td style={tdStyle}>₹{row.q3Revenue.toLocaleString()}</td>
                  <td style={tdStyle}>₹{row.q4Revenue.toLocaleString()}</td>
                  <td style={{
                    ...tdStyle,
                    color: row.variance >= 0 ? '#2ecc71' : '#e74c3c',
                    fontWeight: '500'
                  }}>
                    ₹{row.variance.toLocaleString()}
                  </td>
                  <td style={{
                    ...tdStyle,
                    color: row.variancePercent >= 0 ? '#2ecc71' : '#e74c3c',
                    fontWeight: '500'
                  }}>
                    {row.variancePercent === null ? "None" : `${row.variancePercent.toFixed(2)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuarterlyDashboard;