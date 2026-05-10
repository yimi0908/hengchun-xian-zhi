const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let userList = [];

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 登录页（原样）
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

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = userList.find(u => u.username === username && u.password === password);
  if (user) {
    res.redirect('/');
  } else {
    res.send('登录失败 <a href="/login">重试</a>');
  }
});

// 注册页（原样）
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

app.post('/register', (req, res) => {
  userList.push(req.body);
  res.redirect('/login');
});

// ✅ 终极端口解决方案：优先使用 RAILWAY_PORT
const realPort = process.env.RAILWAY_PORT || process.env.PORT || 3000;

app.listen(realPort, "0.0.0.0", () => {
  console.log("✅ 服务启动成功！");
  console.log("Railway 自动设置的 PORT：", process.env.PORT);
  console.log("实际使用的端口：", realPort);
});
