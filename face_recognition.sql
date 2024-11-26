
CREATE DATABASE IF NOT EXISTS face_recognition;

USE face_recognition;

CREATE TABLE IF NOT EXISTS registered_faces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    descriptor TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL
);