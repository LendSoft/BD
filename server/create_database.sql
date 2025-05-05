-- Создание базы данных
CREATE DATABASE request_management;
\c request_management

-- Таблица ролей (admin, user)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- Таблица типов аварий
CREATE TABLE accident_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Таблица приоритетов
CREATE TABLE priorities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    number INTEGER NOT NULL UNIQUE
);

-- Таблица служб
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Таблица геолокаций
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);

-- Таблица заявок
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    accident_type_id INTEGER NOT NULL,
    priority_id INTEGER NOT NULL,
    applicant VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE RESTRICT,
    FOREIGN KEY (accident_type_id) REFERENCES accident_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (priority_id) REFERENCES priorities(id) ON DELETE RESTRICT
);

-- Таблица перенаправленных заявок (логи)
CREATE TABLE routed_requests (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    routed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);

-- Начальные данные
INSERT INTO roles (name) VALUES ('admin'), ('user');
INSERT INTO services (name) VALUES ('Полиция'), ('МЧС'), ('Больница'), ('Пожарные'), ('Соцслужба'), ('ЖКХ');
INSERT INTO accident_types (name) VALUES ('Пожар'), ('Авария'), ('Наводнение'), ('Кража');
INSERT INTO priorities (name, number) VALUES ('Критический', 1), ('Высокий', 2), ('Средний', 3), ('Низкий', 4);
INSERT INTO users (username, password, role_id) VALUES ('admin', 'admin', 1);