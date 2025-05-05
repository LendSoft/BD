// Исправление кодировки консоли для Windows
process.stdout.setEncoding('utf8');

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL
const pool = new Pool({
  user: 'postgres', // Замени на своего пользователя, если не 'postgres'
  host: 'localhost',
  database: 'request_management',
  password: '123', // Замени на свой пароль
  port: 5432,
});

// Проверка подключения к базе данных
pool.on('error', (err, client) => {
  console.error('Неожиданная ошибка в пуле подключений PostgreSQL:', err.stack);
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message, err.stack);
    return;
  }
  console.log('Успешно подключено к базе данных request_management');
  release();
});

// Тестовый эндпоинт для проверки подключения
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'База данных подключена', time: result.rows[0].now });
  } catch (err) {
    console.error('Ошибка теста базы данных:', err.message);
    res.status(500).json({ error: 'Ошибка подключения к базе данных', details: err.message });
  }
});

// Аутентификация
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Запрос на авторизацию:', { username });
  try {
    const result = await pool.query(
      'SELECT u.id, u.username, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.username = $1 AND u.password = $2',
      [username, password]
    );
    if (result.rows.length) {
      console.log('Успешная авторизация:', result.rows[0]);
      res.json(result.rows[0]);
    } else {
      console.log('Неверный логин или пароль для:', username);
      res.status(401).json({ error: 'Неверный логин или пароль' });
    }
  } catch (err) {
    console.error('Ошибка авторизации:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Регистрация
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('Запрос на регистрацию:', { username });
  try {
    const userExists = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userExists.rows.length) {
      console.log('Пользователь уже существует:', username);
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    const result = await pool.query(
      'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3) RETURNING id, username',
      [username, password, 2] // role_id 2 = user
    );
    console.log('Успешная регистрация:', result.rows[0]);
    res.status(201).json({ ...result.rows[0], role: 'user' });
  } catch (err) {
    console.error('Ошибка регистрации:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Получение всех заявок
app.get('/api/requests', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.applicant, r.phone_number, l.address as addres, at.name as type_accident, p.name as prioritet, l.latitude, l.longitude
      FROM requests r
      JOIN locations l ON r.location_id = l.id
      JOIN accident_types at ON r.accident_type_id = at.id
      JOIN priorities p ON r.priority_id = p.id
    `);
    res.json(result.rows.map(row => ({
      ...row,
      coords: [row.latitude, row.longitude]
    })));
  } catch (err) {
    console.error('Ошибка получения заявок:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Создание заявки
app.post('/api/requests', async (req, res) => {
  const { user_id, address, latitude, longitude, accident_type, priority, applicant, phone_number } = req.body;
  console.log('Создание заявки:', { user_id, address, accident_type, priority });
  try {
    const locationResult = await pool.query(
      'INSERT INTO locations (address, latitude, longitude) VALUES ($1, $2, $3) RETURNING id',
      [address, latitude, longitude]
    );
    const location_id = locationResult.rows[0].id;

    const accidentTypeResult = await pool.query('SELECT id FROM accident_types WHERE name = $1', [accident_type]);
    const priorityResult = await pool.query('SELECT id FROM priorities WHERE name = $1', [priority]);
    
    if (!accidentTypeResult.rows.length || !priorityResult.rows.length) {
      console.log('Неверный тип аварии или приоритет:', { accident_type, priority });
      return res.status(400).json({ error: 'Неверный тип аварии или приоритет' });
    }

    const requestResult = await pool.query(
      'INSERT INTO requests (user_id, location_id, accident_type_id, priority_id, applicant, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [user_id, location_id, accidentTypeResult.rows[0].id, priorityResult.rows[0].id, applicant, phone_number]
    );

    console.log('Заявка создана:', { id: requestResult.rows[0].id });
    res.status(201).json({ id: requestResult.rows[0].id });
  } catch (err) {
    console.error('Ошибка создания заявки:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Обновление заявки
app.put('/api/requests/:id', async (req, res) => {
  const { id } = req.params;
  const { address, latitude, longitude, accident_type, priority, applicant, phone_number } = req.body;
  console.log('Обновление заявки:', { id, address, accident_type, priority });
  try {
    const locationResult = await pool.query(
      'UPDATE locations SET address = $1, latitude = $2, longitude = $3 WHERE id = (SELECT location_id FROM requests WHERE id = $4) RETURNING id',
      [address, latitude, longitude, id]
    );
    if (!locationResult.rows.length) {
      console.log('Заявка не найдена:', id);
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    const accidentTypeResult = await pool.query('SELECT id FROM accident_types WHERE name = $1', [accident_type]);
    const priorityResult = await pool.query('SELECT id FROM priorities WHERE name = $1', [priority]);
    
    if (!accidentTypeResult.rows.length || !priorityResult.rows.length) {
      console.log('Неверный тип аварии или приоритет:', { accident_type, priority });
      return res.status(400).json({ error: 'Неверный тип аварии или приоритет' });
    }

    await pool.query(
      'UPDATE requests SET accident_type_id = $1, priority_id = $2, applicant = $3, phone_number = $4 WHERE id = $5',
      [accidentTypeResult.rows[0].id, priorityResult.rows[0].id, applicant, phone_number, id]
    );

    console.log('Заявка обновлена:', id);
    res.json({ message: 'Заявка обновлена' });
  } catch (err) {
    console.error('Ошибка обновления заявки:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Удаление заявки
app.delete('/api/requests/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Удаление заявки:', id);
  try {
    const result = await pool.query('DELETE FROM requests WHERE id = $1 RETURNING id', [id]);
    if (!result.rows.length) {
      console.log('Заявка не найдена:', id);
      return res.status(404).json({ error: 'Заявка не найдена' });
    }
    console.log('Заявка удалена:', id);
    res.json({ message: 'Заявка удалена' });
  } catch (err) {
    console.error('Ошибка удаления заявки:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Перенаправление заявки
app.post('/api/routed_requests', async (req, res) => {
  const { request_id, service_name } = req.body;
  console.log('Перенаправление заявки:', { request_id, service_name });
  try {
    const serviceResult = await pool.query('SELECT id FROM services WHERE name = $1', [service_name]);
    if (!serviceResult.rows.length) {
      console.log('Неверная служба:', service_name);
      return res.status(400).json({ error: 'Неверная служба' });
    }

    const result = await pool.query(
      'INSERT INTO routed_requests (request_id, service_id) VALUES ($1, $2) RETURNING id',
      [request_id, serviceResult.rows[0].id]
    );
    await pool.query('DELETE FROM requests WHERE id = $1', [request_id]);
    console.log('Заявка перенаправлена:', { id: result.rows[0].id });
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Ошибка перенаправления заявки:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Получение логов перенаправленных заявок
app.get('/api/routed_requests', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT rr.id, r.applicant, r.phone_number, l.address, at.name as accident_type, p.name as priority, s.name as service, rr.routed_at
      FROM routed_requests rr
      JOIN requests r ON rr.request_id = r.id
      JOIN locations l ON r.location_id = l.id
      JOIN accident_types at ON r.accident_type_id = at.id
      JOIN priorities p ON r.priority_id = p.id
      JOIN services s ON rr.service_id = s.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения логов:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Получение типов аварий
app.get('/api/accident_types', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM accident_types');
    res.json(result.rows.map(row => row.name));
  } catch (err) {
    console.error('Ошибка получения типов аварий:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Получение приоритетов
app.get('/api/priorities', async (req, res) => {
  try {
    const result = await pool.query('SELECT name, number FROM priorities');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения приоритетов:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.listen(3001, () => {
  console.log('Сервер запущен на порту 3001');
});