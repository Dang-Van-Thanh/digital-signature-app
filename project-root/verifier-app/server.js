const express = require('express');
const path = require('path');
const fs = require('fs');
const forge = require('node-forge');
const data = require('../shared/data');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Trang đăng nhập
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Xử lý đăng nhập
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = data.getUser(username);
  if (!user || user.password !== password) {
    return res.send(`
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Đăng ký thành công</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <div class="result">
      <h2>❌ Đăng nhập thất bại.</h2>
      <a href="/">↩ Quay lại trang đăng nhập</a>
    </div>
  </body>
  </html>
`);
  }

  res.redirect(`/verify.html?username=${username}`);
});

// Trang xác minh
app.post('/verify', (req, res) => {
  const { sender, filename } = req.body;
  const signedPath = path.join(__dirname, '../shared/signed', `${sender}_${filename}.json`);
  if (!fs.existsSync(signedPath)) {
    return res.send(`
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Đăng ký thành công</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <div class="result">
      <h2>❌ Không tìm thấy file đã ký.</h2>
      <a href="/">↩ Quay lại trang đăng nhập</a>
    </div>
  </body>
  </html>
`);
  }

  const signedData = JSON.parse(fs.readFileSync(signedPath));
  const senderInfo = data.getUser(sender);
  if (!senderInfo) {
    return res.send(`
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Đăng ký thành công</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <div class="result">
      <h2>❌ Không tìm thấy người gửi.</h2>
      <a href="/">↩ Quay lại trang đăng nhập</a>
    </div>
  </body>
  </html>
`);
  }

  const publicKey = forge.pki.publicKeyFromPem(senderInfo.publicKey);
  const buffer = Buffer.from(signedData.content, 'base64');
  const md = forge.md.sha256.create();
  md.update(buffer.toString('binary'));

  const isValid = publicKey.verify(md.digest().bytes(), forge.util.decode64(signedData.signature));

  res.send(`
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Kết quả xác minh</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <div class="result">
      <h2>Kết quả xác minh</h2>
      <p><strong>Người gửi:</strong> ${sender}</p>
      <p><strong>Tên file:</strong> ${filename}</p>
      <p><strong>Trạng thái:</strong> <span style="color: ${isValid ? 'green' : 'red'}; font-weight: bold">${isValid ? '✅ Hợp lệ' : '❌ Không hợp lệ'}</span></p>
      <a href="/">↩ Trở về</a>
    </div>
  </body>
  </html>
  `);
});

app.listen(3002, () => {
  console.log('Verifier chạy tại http://localhost:3002');
});

