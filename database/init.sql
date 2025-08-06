-- Computer Repair Ticket Management System Database Schema

-- Employees/Staff table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hashed password
    phone VARCHAR(20),
    role ENUM('admin', 'technician', 'manager', 'receptionist') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    password_reset_token VARCHAR(255) NULL,
    password_reset_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(255),
    is_business BOOLEAN DEFAULT FALSE,
    email VARCHAR(255),
    mobile_phone VARCHAR(20),
    landline_phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customer_email (email),
    INDEX idx_customer_mobile_phone (mobile_phone),
    INDEX idx_customer_landline_phone (landline_phone)
);

-- Tickets table
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('new', 'in_progress', 'part_pending', 'reply_pending', 'pickup_ready', 'waiting_customer', 'resolved') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_ticket_number (ticket_number),
    INDEX idx_ticket_status (status),
    INDEX idx_ticket_customer (customer_id)
);

-- Ticket messages (emails, SMS, notes)
CREATE TABLE ticket_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    message_type ENUM('email', 'sms', 'note_public', 'note_private') NOT NULL,
    sender_type ENUM('customer', 'employee', 'system') NOT NULL,
    sender_id INT, -- customer_id or employee_id based on sender_type
    content TEXT NOT NULL,
    external_message_id VARCHAR(255), -- for email/SMS provider tracking
    attachments JSON, -- store attachment info as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    INDEX idx_messages_ticket (ticket_id),
    INDEX idx_messages_created (created_at),
    INDEX idx_messages_type (message_type)
);

-- Invoices table
CREATE TABLE invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    ticket_id INT NULL,
    customer_id INT NOT NULL,
    status ENUM('draft', 'unpaid', 'paid', 'cancelled') DEFAULT 'draft',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5,4) DEFAULT 0.0875, -- 8.75% default tax rate
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE NULL,
    payment_method ENUM('cash', 'check', 'credit_card', 'bank_transfer', 'other'),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_invoice_status (status),
    INDEX idx_invoice_customer (customer_id),
    INDEX idx_invoice_dates (issue_date, due_date)
);


-- Ticket line items (services, parts, labor, etc.)
CREATE TABLE ticket_line_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    is_taxable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    INDEX idx_line_items_ticket (ticket_id)
);

-- Invoice line items (snapshot of ticket line items when invoice was created)
CREATE TABLE invoice_line_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    original_ticket_line_item_id INT, -- reference to original ticket line item
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    is_taxable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_invoice_line_items_invoice (invoice_id)
);


-- Seed data for development/testing
INSERT IGNORE INTO employees (first_name, last_name, email, password_hash, phone, role) VALUES 
    ('Admin', 'User', 'admin@repairshop.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-0001', 'admin'),
    ('John', 'Tech', 'john.tech@repairshop.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-0002', 'technician'),
    ('Jane', 'Manager', 'jane.manager@repairshop.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-0003', 'manager');

INSERT IGNORE INTO customers (first_name, last_name, company_name, is_business, email, mobile_phone, landline_phone, notes) VALUES 
    ('Alice', 'Johnson', NULL, FALSE, 'alice@email.com', '555-1001', NULL, 'Prefers email communication'),
    ('Bob', 'Smith', 'Smith Consulting', TRUE, 'bob@smithconsulting.com', '555-1002', '555-1003', 'Business customer with multiple devices'),
    ('Carol', 'Davis', NULL, FALSE, 'carol@email.com', '555-1004', NULL, NULL);

INSERT IGNORE INTO tickets (ticket_number, customer_id, title, description, status) VALUES 
    ('T-2024-001', 1, 'Laptop Screen Repair', 'Customer reports cracked laptop screen after drop. Dell Inspiron 15.', 'new'),
    ('T-2024-002', 2, 'Network Setup', 'Business customer needs office network configuration for 10 workstations.', 'in_progress'),
    ('T-2024-003', 3, 'Virus Removal', 'Computer running slow, suspected malware infection.', 'new');

INSERT IGNORE INTO ticket_line_items (ticket_id, description, quantity, unit_price, is_taxable) VALUES 
    (1, 'Dell Inspiron 15 Screen Replacement', 1, 150.00, TRUE),
    (1, 'Screen Installation Labor', 1, 75.00, TRUE),
    (2, 'Network Router Configuration', 1, 200.00, TRUE),
    (2, 'Workstation Setup (per unit)', 10, 50.00, TRUE),
    (3, 'Virus/Malware Removal Service', 1, 99.00, TRUE);

INSERT IGNORE INTO ticket_messages (ticket_id, message_type, sender_type, sender_id, content) VALUES 
    (1, 'note_private', 'employee', 2, 'Customer confirmed they dropped laptop. Screen part ordered.'),
    (2, 'email', 'customer', NULL, 'When can you start the network setup? We need it completed by Friday.'),
    (3, 'note_public', 'employee', 2, 'Initial diagnosis complete. Found multiple malware infections. Estimated 2-3 hours for cleanup.')