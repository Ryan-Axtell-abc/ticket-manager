const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.get('/api/customers', async (req, res) => {
  try {
    console.log('Attempting database connection...');
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM customers');
    await connection.end();
    
    console.log('Found customers:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

app.get('/api/tickets', async (req, res) => {
  try {
    console.log('Attempting tickets database connection...');
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT t.*, c.name as customer_name, c.phone as customer_phone 
      FROM tickets t 
      JOIN customers c ON t.customer_id = c.id
    `);
    await connection.end();
    
    console.log('Found tickets:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
