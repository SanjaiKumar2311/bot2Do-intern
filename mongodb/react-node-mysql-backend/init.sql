CREATE DATABASE IF NOT EXISTS react_db;
USE react_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com'), ('Jane Doe', 'jane@example.com');
