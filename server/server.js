process.stdout.setEncoding('utf8');

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'request_management',
  password: '123',
  port: 5432,
});

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

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'База данных подключена', time: result.rows[0].now });
  } catch (err) {
    console.error('Ошибка теста базы данных:', err.message);
    res.status(500).json({ error: 'Ошибка подключения к базе данных', details: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Запрос на авторизацию:', { username });
  try {
    const result = await pool.query(
      'SELECT u.id, u.username, u.first_name, u.last_name, u.phone_number, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.username = $1 AND u.password = $2',
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

app.post('/api/register', async (req, res) => {
  const { username, password, first_name, last_name, phone_number } = req.body;
  console.log('Запрос на регистрацию:', { username });
  try {
    const userExists = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userExists.rows.length) {
      console.log('Пользователь уже существует:', username);
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    const result = await pool.query(
      'INSERT INTO users (username, password, role_id, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, first_name, last_name, phone_number',
      [username, password, 2, first_name, last_name, phone_number]
    );
    console.log('Успешная регистрация:', result.rows[0]);
    res.status(201).json({ ...result.rows[0], role: 'user' });
  } catch (err) {
    console.error('Ошибка регистрации:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.get('/api/requests', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.applicant, r.phone_number, l.address as addres, at.name as incident, p.name as prioritet, l.latitude, l.longitude, u.id as user_id, u.first_name, u.last_name
      FROM requests r
      JOIN locations l ON r.location_id = l.id
      JOIN accident_types at ON r.accident_type_id = at.id
      JOIN priorities p ON r.priority_id = p.id
      JOIN users u ON r.user_id = u.id
    `);
    res.json(result.rows.map(row => ({
      ...row,
      coords: [row.latitude, row.longitude],
      creator: {
        id: row.user_id,
        full_name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.username
      }
    })));
  } catch (err) {
    console.error('Ошибка получения заявок:', err.message, err.stack);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.get('/api/user_requests/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT rh.id, rh.request_id, rh.applicant, rh.phone_number, l.address as addres, at.name as incident, p.name as prioritet, l.latitude, l.longitude, rh.status
      FROM request_history rh
      JOIN locations l ON rh.location_id = l.id
      JOIN accident_types at ON rh.accident_type_id = at.id
      JOIN priorities p ON rh.priority_id = p.id
      WHERE rh.user_id = $1
    `, [user_id]);
    res.json(result.rows.map(row => ({
      ...row,
      coords: [row.latitude, row.longitude]
    })));
  } catch (err) {
    console.error('Ошибка получения заявок пользователя:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

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
      console.log('Неверное происшествие или приоритет:', { accident_type, priority });
      return res.status(400).json({ error: 'Неверное происшествие или приоритет' });
    }

    const requestResult = await pool.query(
      'INSERT INTO requests (user_id, location_id, accident_type_id, priority_id, applicant, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [user_id, location_id, accidentTypeResult.rows[0].id, priorityResult.rows[0].id, applicant, phone_number]
    );
    const request_id = requestResult.rows[0].id;

    await pool.query(
      'INSERT INTO request_history (request_id, user_id, location_id, accident_type_id, priority_id, applicant, phone_number, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [request_id, user_id, location_id, accidentTypeResult.rows[0].id, priorityResult.rows[0].id, applicant, phone_number, 'submitted']
    );

    console.log('Заявка создана:', { id: request_id });
    res.status(201).json({ id: request_id });
  } catch (err) {
    console.error('Ошибка создания заявки:', err.message, err.stack);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

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
      console.log('Неверное происшествие или приоритет:', { accident_type, priority });
      return res.status(400).json({ error: 'Неверное происшествие или приоритет' });
    }

    await pool.query(
      'UPDATE requests SET accident_type_id = $1, priority_id = $2, applicant = $3, phone_number = $4 WHERE id = $5',
      [accidentTypeResult.rows[0].id, priorityResult.rows[0].id, applicant, phone_number, id]
    );

    await pool.query(
      'UPDATE request_history SET accident_type_id = $1, priority_id = $2, applicant = $3, phone_number = $4 WHERE request_id = $5',
      [accidentTypeResult.rows[0].id, priorityResult.rows[0].id, applicant, phone_number, id]
    );

    await pool.query(
      'UPDATE locations SET address = $1, latitude = $2, longitude = $3 WHERE id = (SELECT location_id FROM request_history WHERE request_id = $4)',
      [address, latitude, longitude, id]
    );

    console.log('Заявка обновлена:', id);
    res.json({ message: 'Заявка обновлена' });
  } catch (err) {
    console.error('Ошибка обновления заявки:', err.message, err.stack);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.delete('/api/requests/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Удаление заявки:', id);
  try {
    await pool.query('UPDATE request_history SET status = $1 WHERE request_id = $2', ['deleted', id]);
    const result = await pool.query('DELETE FROM requests WHERE id = $1 RETURNING id', [id]);
    if (!result.rows.length) {
      console.log('Заявка не найдена:', id);
      return res.status(404).json({ error: 'Заявка не найдена' });
    }
    console.log('Заявка удалена:', id);
    res.json({ message: 'Заявка удалена' });
  } catch (err) {
    console.error('Ошибка удаления заявки:', err.message, err.stack);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.post('/api/routed_requests', async (req, res) => {
  const { request_id, service_name, applicant, phone_number, address, accident_type, priority } = req.body;
  console.log('Перенаправление заявки:', { request_id, service_name });
  try {
    const serviceResult = await pool.query('SELECT id FROM services WHERE name = $1', [service_name]);
    if (!serviceResult.rows.length) {
      console.log('Неверная служба:', service_name);
      return res.status(400).json({ error: 'Неверная служба' });
    }

    const result = await pool.query(
      'INSERT INTO routed_requests (request_id, service_id, applicant, phone_number, address, accident_type, priority) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [request_id, serviceResult.rows[0].id, applicant, phone_number, address, accident_type, priority]
    );

    await pool.query('UPDATE request_history SET status = $1 WHERE request_id = $2', ['routed', request_id]);
    await pool.query('DELETE FROM requests WHERE id = $1', [request_id]);

    console.log('Заявка перенаправлена:', { id: result.rows[0].id });
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Ошибка перенаправления заявки:', err.message, err.stack);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.get('/api/routed_requests', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT rr.id, rr.applicant, rr.phone_number, rr.address, rr.accident_type as incident, rr.priority, s.name as service, rr.routed_at
      FROM routed_requests rr
      JOIN services s ON rr.service_id = s.id
    `);
    console.log('Логи успешно получены:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения логов:', err.message, err.stack);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.get('/api/accident_types', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM accident_types');
    res.json(result.rows.map(row => row.name));
  } catch (err) {
    console.error('Ошибка получения типов происшествий:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.get('/api/priorities', async (req, res) => {
  try {
    const result = await pool.query('SELECT name, number FROM priorities');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения приоритетов:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.phone_number, c.address, c.description, s.name as service
      FROM contacts c
      LEFT JOIN services s ON c.service_id = s.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения контактов:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.get('/api/profile/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, username, first_name, last_name, phone_number FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (err) {
    console.error('Ошибка получения профиля:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.put('/api/profile/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone_number, password, current_user_id } = req.body;
  try {
    const currentUser = await pool.query(
      'SELECT role_id FROM users WHERE id = $1',
      [current_user_id]
    );
    if (!currentUser.rows.length) {
      return res.status(401).json({ error: 'Текущий пользователь не найден' });
    }
    const isAdmin = currentUser.rows[0].role_id === 1;

    if (!isAdmin && parseInt(id) !== parseInt(current_user_id)) {
      return res.status(403).json({ error: 'Доступ запрещён: вы не можете редактировать чужой профиль' });
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (first_name !== undefined) {
      updates.push(`first_name = $${paramIndex++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push(`last_name = $${paramIndex++}`);
      values.push(last_name);
    }
    if (phone_number !== undefined) {
      updates.push(`phone_number = $${paramIndex++}`);
      values.push(phone_number);
    }
    if (password) {
      updates.push(`password = $${paramIndex++}`);
      values.push(password);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Нет данных для обновления' });
    }

    values.push(id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, username, first_name, last_name, phone_number`;
    
    const result = await pool.query(query, values);
    if (result.rows.length) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (err) {
    console.error('Ошибка обновления профиля:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

app.listen(3001, () => {
  console.log('Сервер запущен на порту 3001');
});