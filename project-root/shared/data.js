// shared/data.js
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'storage.json');

// Tạo file nếu chưa tồn tại
if (!fs.existsSync(DATA_PATH)) {
  fs.writeFileSync(DATA_PATH, JSON.stringify({ users: [], files: [], logs: [] }, null, 2));
}

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_PATH));
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  // Người dùng
  getUser(username) {
    return loadData().users.find(u => u.username === username);
  },
  addUser(user) {
    const data = loadData();
    data.users.push(user);
    saveData(data);
  },

  // File đã ký
  addSignedFile(fileObj) {
    const data = loadData();
    data.files.push(fileObj);
    saveData(data);
  },
  findSignedFile(sender, fileName) {
    return loadData().files.find(f => f.sender === sender && f.fileName === fileName);
  },

  // Nhật ký xác minh
  addLog(log) {
    const data = loadData();
    data.logs.push(log);
    saveData(data);
  },
  getLogs() {
    return loadData().logs;
  },

  // Lấy toàn bộ người dùng / file
  getAllUsers() {
    return loadData().users;
  },
  getAllFiles() {
    return loadData().files;
  }
};
