-- Active: 1760178178339@@127.0.0.1@3306@chat_service
CREATE TABLE IF NOT EXISTS migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    batch INT NOT NULL,
    direction ENUM('up', 'down') NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);