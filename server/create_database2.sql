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
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
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

-- Таблица истории заявок
CREATE TABLE request_history (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    accident_type_id INTEGER NOT NULL,
    priority_id INTEGER NOT NULL,
    applicant VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'submitted',
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
    -- Полиция
    ('Кража'), ('Нападение'), ('Вандализм'), ('Нарушение общественного порядка'), ('Дорожно-транспортное происшествие'),
    ('Мошенничество'), ('Хулиганство'), ('Угроза жизни'), ('Незаконное проникновение'), ('Похищение'),
    -- МЧС
    ('Наводнение'), ('Обрушение здания'), ('Химическая утечка'), ('Поиск пропавших'), ('Землетрясение'),
    ('Сель'), ('Оползень'), ('Радиационная авария'), ('Техногенная катастрофа'), ('Эвакуация'),
    -- Больница
    ('Травма'), ('Сердечный приступ'), ('Отравление'), ('Эпидемия'), ('Кровотечение'),
    ('Аллергическая реакция'), ('Судороги'), ('Потеря сознания'), ('Перелом'), ('Ожог'),
    -- Пожарные
    ('Пожар'), ('Задымление'), ('Возгорание техники'), ('Лесной пожар'), ('Взрыв газа'),
    ('Короткое замыкание'), ('Пожар в транспорте'), ('Пожар в жилом доме'), ('Химический пожар'),
    -- Соцслужба
    ('Семейное насилие'), ('Злоупотребление алкоголем'), ('Наркотическая зависимость'), ('Психологический кризис'),
    ('Социальная изоляция'),
    -- ЖКХ
    ('Прорыв трубы'), ('Отключение электричества'), ('Поломка лифта'), ('Засор канализации'), ('Авария теплоснабжения'),
    ('Утечка газа'), ('Повреждение кровли'), ('Отсутствие водоснабжения'), ('Авария канализации'),
    -- Другое
    ('Срочный вызов'), ('Неуточнённое происшествие'), ('Другое');
INSERT INTO priorities (name, number) VALUES ('Незамедлительно', 1), ('Высокий', 2), ('Средний', 3), ('Низкий', 4);
INSERT INTO users (username, password, role_id, first_name, last_name, phone_number) 
VALUES ('admin', 'admin', 1, 'Админ', 'Админов', '+7 (999) 999-99-99');
INSERT INTO contacts (service_id, phone_number, address, description) VALUES
    ((SELECT id FROM services WHERE name = 'Другое'), '+7 (846) 956-07-66', 'г. Самара, просп. Кирова, 223', 'Для срочных случаев или отсутствия подходящего пункта в заявке'),
    ((SELECT id FROM services WHERE name = 'МЧС'), '+7 (846) 338-96-06', 'г. Самара, ул. Галактионовская, 193', 'Для чрезвычайных ситуаций, требующих немедленного реагирования'),
    ((SELECT id FROM services WHERE name = 'Больница'), '+7 (846) 266-92-35', 'г. Самара, ул. Больничная, 2', 'Скорая помощь и медицинские консультации'),
    ((SELECT id FROM services WHERE name = 'Пожарные'), '+7 (846) 338-04-01', 'г. Самара, ул. Чернореченская, 55', 'Для сообщений о пожарах и задымлениях'),
    ((SELECT id FROM services WHERE name = 'Соцслужба'), '+7 (846) 337-64-56', 'г. Самара, ул. Первомайская, 26', 'Поддержка уязвимых групп населения'),
    ((SELECT id FROM services WHERE name = 'ЖКХ'), '+7 (846) 333-03-39', 'г. Самара, ул. Некрасовская, 62', 'Для жалоб на коммунальные услуги'),
    ((SELECT id FROM services WHERE name = 'Полиция'), '102', 'г. Самара, ул. Мориса Тореза, 12', 'Единый центр подачи заявок для неуточнённых или срочных случаев');