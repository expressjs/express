'use strict';

const express = require('../../');
const app = express();

const PORT = process.env.PORT || 3000;

// 模拟数据库
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// 内置中间件：解析 JSON 和表单
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志中间件
app.use(function (req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 根路由
app.get('/', function (req, res) {
  res.json({
    message: 'Express User REST API is running',
    endpoints: [
      'GET /api/users',
      'GET /api/users/:id',
      'POST /api/users',
      'PUT /api/users/:id',
      'DELETE /api/users/:id'
    ]
  });
});

// 获取所有用户
app.get('/api/users', function (req, res) {
  res.status(200).json({
    success: true,
    data: users
  });
});

// 获取单个用户
app.get('/api/users/:id', function (req, res, next) {
  const id = Number(req.params.id);
  const user = users.find(function (item) {
    return item.id === id;
  });

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    return next(err);
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// 创建用户
app.post('/api/users', function (req, res, next) {
  const { name, email } = req.body;

  if (!name || !email) {
    const err = new Error('name and email are required');
    err.status = 400;
    return next(err);
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name: String(name),
    email: String(email)
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

// 更新用户
app.put('/api/users/:id', function (req, res, next) {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  const index = users.findIndex(function (item) {
    return item.id === id;
  });

  if (index === -1) {
    const err = new Error('User not found');
    err.status = 404;
    return next(err);
  }

  users[index] = {
    ...users[index],
    ...(name ? { name: String(name) } : {}),
    ...(email ? { email: String(email) } : {})
  };

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: users[index]
  });
});

// 删除用户
app.delete('/api/users/:id', function (req, res, next) {
  const id = Number(req.params.id);

  const index = users.findIndex(function (item) {
    return item.id === id;
  });

  if (index === -1) {
    const err = new Error('User not found');
    err.status = 404;
    return next(err);
  }

  const deletedUser = users[index];
  users.splice(index, 1);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

// 404 处理中间件
app.use(function (req, res) {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// 错误处理中间件
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
});
