require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 解析表单数据
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // 新增：支持AI接口JSON数据

// 登录状态标记
let isLogin = false;
let userList = [];

// 托管静态网页（保证你的index.html、所有文件正常加载）
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  // 直接显示你的平台！不跳登录了
  res.sendFile(__dirname + '/index.html');
});

// 登录页面 - 加宽卡片+加大内边距，更舒展
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>登录</title>
        <style>
            body {
                background-color: #f8f5f0;
                font-family: "Microsoft YaHei", sans-serif;
                margin: 0;
                padding-top: 120px;
            }
            .login-box {
                /* 加宽卡片到480px，布局更舒展 */
                width: 480px;
                margin: 0 auto;
                background: white;
                /* 加大内边距，避免内容挤在一起 */
                padding: 50px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            h2 {
                color: #2c5f4a;
                text-align: center;
                margin: 0 0 35px 0;
                font-size: 26px;
            }
            input {
                width: 100%;
                padding: 14px;
                margin: 12px 0;
                border: 1px solid #ddd;
                border-radius: 6px;
                box-sizing: border-box;
                font-size: 16px;
            }
            button {
                width: 100%;
                padding: 14px;
                background: #2c5f4a;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                margin-top: 10px;
            }
            a {
                display: block;
                text-align: center;
                margin-top: 20px;
                color: #2c5f4a;
                text-decoration: none;
                font-size: 15px;
            }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h2>登录</h2>
            <form method="POST" action="/login">
                <input type="text" name="username" placeholder="账号">
                <input type="password" name="password" placeholder="密码">
                <button type="submit">登录</button>
            </form>
            <a href="/register">没有账号？去注册</a>
        </div>
    </body>
    </html>
  `);
});

// 登录提交
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = userList.find(u => u.username === username && u.password === password);
  
  if (user) {
    isLogin = true;
    res.redirect('/');
  } else {
    res.send('登录失败 <a href="/login">重试</a>');
  }
});

// 注册页面 - 和登录页同尺寸优化
app.get('/register', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>注册</title>
        <style>
            body {
                background-color: #f8f5f0;
                font-family: "Microsoft YaHei", sans-serif;
                margin: 0;
                padding-top: 120px;
            }
            .register-box {
                width: 480px;
                margin: 0 auto;
                background: white;
                padding: 50px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            h2 {
                color: #2c5f4a;
                text-align: center;
                margin: 0 0 35px 0;
                font-size: 26px;
            }
            input {
                width: 100%;
                padding: 14px;
                margin: 12px 0;
                border: 1px solid #ddd;
                border-radius: 6px;
                box-sizing: border-box;
                font-size: 16px;
            }
            button {
                width: 100%;
                padding: 14px;
                background: #2c5f4a;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 15px;
                margin-top: 10px;
            }
            a {
                display: block;
                text-align: center;
                margin-top: 20px;
                color: #2c5f4a;
                text-decoration: none;
                font-size: 15px;
            }
        </style>
    </head>
    <body>
        <div class="register-box">
            <h2>注册</h2>
            <form method="POST" action="/register">
                <input type="text" name="username" placeholder="设置账号" required>
                <input type="password" name="password" placeholder="设置密码" required>
                <button type="submit">注册</button>
            </form>
            <a href="/login">已有账号？去登录</a>
        </div>
    </body>
    </html>
  `);
});

// 注册提交
app.post('/register', (req, res) => {
  userList.push({
    username: req.body.username,
    password: req.body.password
  });
  res.redirect('/login');
});

// ===================== 安全DeepSeek代理接口 =====================
app.post('/api/deepseek', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'AI请求失败' });
  }
});

// 只保留这一个启动监听！！
app.listen(port, "0.0.0.0", () => {
  console.log("服务启动成功，端口：" + port);
});
