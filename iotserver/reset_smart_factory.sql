DROP DATABASE IF EXISTS smart_factory;
CREATE DATABASE smart_factory DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_factory;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE ai_models (
    id INT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    description TEXT,
    weight_file_path VARCHAR(255) DEFAULT 'best.pt'
) ENGINE=InnoDB;

INSERT INTO ai_models (id, model_name, description, weight_file_path) VALUES
(1, 'YOLOv8 Multi-Defect Detection', '딥러닝 기반 실시간 결함 검출', 'best.pt');

CREATE TABLE devices (
    device_id INT PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    device_ip VARCHAR(50) DEFAULT '10.10.16.117',
    status VARCHAR(20) DEFAULT 'IDLE',
    occupied_by VARCHAR(50) DEFAULT NULL,
    current_model_id INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO devices (device_id, device_name, device_ip, status, occupied_by, current_model_id) VALUES
(1, 'Jetson Nano #1', '10.10.16.117', 'IDLE', NULL, 0);

CREATE TABLE inspection_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    model_id INT DEFAULT 1,
    result VARCHAR(32) NOT NULL,
    confidence FLOAT DEFAULT 0.95,
    inspected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
