const express = require('express');
const bodyParser = require('body-parser');
const forge = require('node-forge');
const data = require('../shared/data');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (data.getUser(username)) {
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
      <h2>❌ Tên tài khoản đã tồn tại.</h2>
      <a href="/">↩ Quay lại trang đăng nhập</a>
    </div>
  </body>
  </html>
`);
  }

  const keypair = forge.pki.rsa.generateKeyPair(2048);
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);

  data.addUser({ username, password, publicKey: publicKeyPem, privateKey: privateKeyPem });
  res.send(`
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Đăng ký thành công</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <div class="result">
      <h2>✅ Đăng ký thành công</h2>
      <p>Bạn đã tạo tài khoản mới thành công.</p>
      <a href="/">↩ Quay lại trang đăng nhập</a>
    </div>
  </body>
  </html>
`);
});

app.listen(5000, () => {
  console.log('Auth server chạy tại http://localhost:5000');
});
