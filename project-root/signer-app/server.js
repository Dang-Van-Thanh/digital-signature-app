const express = require('express');
const multer = require('multer');
const forge = require('node-forge');
const fs = require('fs');
const path = require('path');
const data = require('../shared/data');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

app.post('/sign', upload.single('file'), (req, res) => {
  const { username, recipient } = req.body;
  const user = data.getUser(username);
  if (!user) return res.send(`
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Đăng ký thành công</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <div class="result">
      <h2>❌ Không tìm thấy người dùng.</h2>
      <a href="/">↩ Quay lại trang đăng nhập</a>
    </div>
  </body>
  </html>
`);

  const fileBuffer = fs.readFileSync(req.file.path);
  const privateKey = forge.pki.privateKeyFromPem(user.privateKey);
  const md = forge.md.sha256.create();
  md.update(fileBuffer.toString('binary'));
  const signature = forge.util.encode64(privateKey.sign(md));

  const result = {
    sender: username,
    recipient,
    fileName: req.file.originalname,
    content: fileBuffer.toString('base64'),
    signature,
    timestamp: new Date().toISOString()
  };

  const outPath = path.join(__dirname, '../shared/signed', `${username}_${req.file.originalname}.json`);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  data.addSignedFile({ sender: username, recipient, fileName: req.file.originalname });

  res.send(`
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Ký thành công</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <div class="result">
      <h2>Ký số thành công ✅</h2>
      <p>File đã được ký và lưu thành công.</p>
      <a href="/">↩ Quay lại</a>
    </div>
  </body>
  </html>
`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

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

  res.redirect(`/sign.html?username=${username}`);
});


app.listen(3001, () => {
  console.log('Signer chạy tại http://localhost:3001');
});
