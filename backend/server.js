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
      SELECT 
        t.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.mobile_phone as customer_phone,
        c.landline_phone as customer_landline,
        c.email as customer_email,
        c.company_name as customer_company
      FROM tickets t 
      JOIN customers c ON t.customer_id = c.id
      ORDER BY t.created_at DESC
    `);
    await connection.end();
    
    console.log('Found tickets:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Get ticket details with line items and messages
app.get('/api/tickets/:id', async (req, res) => {
  try {
    const ticketId = req.params.id;
    const connection = await mysql.createConnection(dbConfig);
    
    // Get ticket with customer info
    const [ticketRows] = await connection.execute(`
      SELECT 
        t.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.mobile_phone as customer_phone,
        c.landline_phone as customer_landline,
        c.email as customer_email,
        c.company_name as customer_company,
        c.is_business as customer_is_business
      FROM tickets t 
      JOIN customers c ON t.customer_id = c.id
      WHERE t.id = ?
    `, [ticketId]);

    if (ticketRows.length === 0) {
      await connection.end();
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Get line items
    const [lineItems] = await connection.execute(`
      SELECT * FROM ticket_line_items 
      WHERE ticket_id = ? 
      ORDER BY created_at ASC
    `, [ticketId]);

    // Get messages
    const [messages] = await connection.execute(`
      SELECT 
        tm.*,
        CASE 
          WHEN tm.sender_type = 'employee' THEN CONCAT(e.first_name, ' ', e.last_name)
          WHEN tm.sender_type = 'customer' THEN CONCAT(c.first_name, ' ', c.last_name)
          ELSE 'System'
        END as sender_name
      FROM ticket_messages tm
      LEFT JOIN employees e ON tm.sender_type = 'employee' AND tm.sender_id = e.id
      LEFT JOIN customers c ON tm.sender_type = 'customer' AND tm.sender_id = c.id
      WHERE tm.ticket_id = ?
      ORDER BY tm.created_at ASC
    `, [ticketId]);

    await connection.end();

    const ticket = {
      ...ticketRows[0],
      line_items: lineItems,
      messages: messages
    };

    res.json(ticket);
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT id, first_name, last_name, email, phone, role, is_active, created_at
      FROM employees 
      WHERE is_active = TRUE
      ORDER BY first_name, last_name
    `);
    await connection.end();
    
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});