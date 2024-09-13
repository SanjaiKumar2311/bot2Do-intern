const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2 with Promises

const app = express();
app.use(express.json()); // To parse JSON request bodies

// MySQL connection setup
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'userdb',
  port: process.env.DB_PORT || 3306
};

let connection;

async function handleDisconnect() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL');
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
    setTimeout(handleDisconnect, 2000); // Reconnect after 2 seconds if there's an error
  }

  connection.on('error', (err) => {
    console.error('MySQL connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect if the connection is lost
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// API endpoint to add a new user
app.post('/add-user', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  try {
    const [result] = await connection.execute(query, [name, email]);
    res.status(201).send('User added successfully');
  } catch (err) {
    console.error('Error inserting data into MySQL:', err);
    res.status(500).send('Database error');
  }
});

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  if (connection) {
    await connection.end();
  }
  process.exit();
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
