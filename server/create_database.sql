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

-- Таблица типов происшествий
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

-- Таблица контактов
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    service_id INTEGER,
    phone_number VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    description TEXT,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
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
    request_id INTEGER,
    service_id INTEGER NOT NULL,
    applicant VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    accident_type VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    routed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);

-- Начальные данные
INSERT INTO roles (name) VALUES ('admin'), ('user');
INSERT INTO services (name) VALUES ('Полиция'), ('МЧС'), ('Больница'), ('Пожарные'), ('Соцслужба'), ('ЖКХ'), ('Другое');
INSERT INTO accident_types (name) VALUES 
    ('Кража'), ('Нападение'), ('Вандализм'), ('Нарушение общественного порядка'), ('Дорожно-транспортное происшествие'),
    ('Наводнение'), ('Обрушение здания'), ('Химическая утечка'), ('Поиск пропавших'),
    ('Травма'), ('Сердечный приступ'), ('Отравление'), ('Эпидемия'),
    ('Пожар'), ('Задымление'), ('Возгорание техники'),
    ('Бездомность'), ('Семейное насилие'), ('Помощь пожилым'),
    ('Прорыв трубы'), ('Отключение электричества'), ('Поломка лифта'), ('Засор канализации'), ('Другое');
INSERT INTO priorities (name, number) VALUES ('Незамедлительно', 1), ('Высокий', 2), ('Средний', 3), ('Низкий', 4);
INSERT INTO users (username, password, role_id) VALUES ('admin', 'admin', 1);
INSERT INTO contacts (service_id, phone_number, address, description) VALUES
    ((SELECT id FROM services WHERE name = 'Полиция'), '+7 (846) 123-45-67', 'г. Самара, ул. Ленина, 10', 'Для срочных случаев или отсутствия подходящего пункта в заявке'),
    ((SELECT id FROM services WHERE name = 'МЧС'), '+7 (846) 987-65-43', 'г. Самара, ул. Советская, 25', 'Для чрезвычайных ситуаций, требующих немедленного реагирования'),
    ((SELECT id FROM services WHERE name = 'Больница'), '+7 (846) 555-01-01', 'г. Самара, ул. Здоровья, 5', 'Скорая помощь и медицинские консультации'),
    ((SELECT id FROM services WHERE name = 'Пожарные'), '+7 (846) 111-22-33', 'г. Самара, ул. Огненная, 3', 'Для сообщений о пожарах и задымлениях'),
    ((SELECT id FROM services WHERE name = 'Соцслужба'), '+7 (846) 444-55-66', 'г. Самара, ул. Социальная, 15', 'Поддержка уязвимых групп населения'),
    ((SELECT id FROM services WHERE name = 'ЖКХ'), '+7 (846) 777-88-99', 'г. Самара, ул. Коммунальная, 20', 'Для жалоб на коммунальные услуги'),
    (NULL, '+7 (846) 000-00-00', 'г. Самара, ул. Центральная, 1', 'Единый центр подачи заявок в случае отсутствия подходящего пункта');