CREATE TABLE CustomerSegments (
    segment_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

CREATE TABLE Customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_code VARCHAR(10) UNIQUE,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255),  -- Secure password hash
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    segment_id INT,
    FOREIGN KEY (segment_id) REFERENCES CustomerSegments(segment_id)
);


DELIMITER //

CREATE TRIGGER before_insert_customers
BEFORE INSERT ON Customers
FOR EACH ROW
BEGIN
    DECLARE year_suffix CHAR(2);
    DECLARE padded_id CHAR(4);

    SET year_suffix = RIGHT(YEAR(CURDATE()), 2);
    SET padded_id = LPAD((SELECT IFNULL(MAX(id), 0) + 1 FROM Customers), 4, '0');
    SET NEW.customer_code = CONCAT('C', year_suffix, padded_id);
END;
//

DELIMITER ;

CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(10) UNIQUE,
    name VARCHAR(100),
    category VARCHAR(100),
    price DECIMAL(10,2),
    description TEXT
);

DELIMITER //

CREATE TRIGGER before_insert_products
BEFORE INSERT ON Products
FOR EACH ROW
BEGIN
    DECLARE year_suffix CHAR(2);
    DECLARE padded_id CHAR(4);

    SET year_suffix = RIGHT(YEAR(CURDATE()), 2);
    SET padded_id = LPAD((SELECT IFNULL(MAX(id), 0) + 1 FROM Products), 4, '0');
    SET NEW.product_code = CONCAT('P', year_suffix, padded_id);
END;
//

DELIMITER ;

CREATE TABLE Purchases (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity INT,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES Customers(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

CREATE TABLE Recommendations (
    rec_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    score DECIMAL(3,2),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

CREATE TABLE Chats (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    status VARCHAR(20),
    FOREIGN KEY (customer_id) REFERENCES Customers(id)
);

CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT,
    sender_type ENUM('customer', 'bot'),
    message_content TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES Chats(chat_id)
);

CREATE TABLE LoyaltyPoints (
    loyalty_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    points_earned INT DEFAULT 0,
    points_redeemed INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(id)
);

CREATE TABLE Rewards (
    reward_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    points_required INT
);

CREATE TABLE Redemptions (
    redemption_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    reward_id INT,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(id),
    FOREIGN KEY (reward_id) REFERENCES Rewards(reward_id)
);
