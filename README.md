# Hệ thống Chữ Ký Số Nhiều Người Dùng (3 ứng dụng liên kết)

## Giới thiệu

Đây là một hệ thống **chữ ký số đơn giản** dùng RSA, được chia thành 3 ứng dụng riêng biệt nhưng liên kết:
- `auth-server`: đăng ký, sinh cặp khóa RSA.
- `signer-app`: người dùng đăng nhập và ký số file gửi cho người khác.
- `verifier-app`: xác minh chữ ký và nội dung file đã ký.

Mọi dữ liệu (người dùng, khóa, file ký) đều lưu trong RAM qua module `shared/data.js`, **không cần cơ sở dữ liệu**.

---

## Cấu trúc thư mục dự án
```
project-root/
├── auth-server/ # Server đăng ký, đăng nhập
│ ├── server.js
│ └── public/ # Giao diện đăng nhập / đăng ký
├── signer-app/ # Server ký số file
│ ├── server.js
│ └── public/ # Giao diện đăng nhập / ký số
├── verifier-app/ # Server xác minh file đã ký
│ ├── server.js
│ └── public/ # Giao diện đăng nhập / xác minh
├── shared/ # Dữ liệu dùng chung
│ ├── data.js # Lưu người dùng và file đã ký
│ └── signed/ # File đã ký được lưu ở đây
```

---

## Yêu cầu

- Node.js (>=14)
- Không cần database
- Không cần frontend framework

---

## Công nghệ

- Node.js + Express: Backend
- node-forge: Sinh khóa và xử lý chữ ký RSA
- multer: Upload file
- HTML / CSS: Giao diện đơn giản

---

## Cách chạy hệ thống

### 1. Cài đặt thư viện cho mỗi ứng dụng
``` bash
npm init -y
npm install express body-parser multer node-forge
```

### 2 Chạy các ứng dụng
Auth Server (port 5000):
``` bash
cd auth-server
node server.js
```
Mở trình duyệt: http://localhost:5000

Signer App (port 3001):
``` bash
cd signer-app
node server.js
```
Mở trình duyệt: http://localhost:3001

Verifier App (port 3002):
``` bash
cd verifier-app
node server.js
```
Mở trình duyệt: http://localhost:3002

---

## Cách sử dụng

### 1. Truy cập http://localhost:5000 để:
- Đăng ký tài khoản
- Hệ thống sinh cặp khóa RSA và lưu vào RAM

### 2. Truy cập http://localhost:3001 để:
- Đăng nhập và chọn file ký
- Gửi file đã ký cho người nhận (lưu ở shared/signed/)

### 3. Truy cập http://localhost:3002 để:
- Nhập tên người gửi + tên file để xác minh
- Hệ thống kiểm tra chữ ký hợp lệ bằng khóa công khai

---

## Ghi chú

- Dữ liệu không được lưu vĩnh viễn, mọi thông tin bị mất sau khi dừng server.
- Hệ thống phù hợp để mô phỏng hoặc học tập nguyên lý hoạt động của chữ ký số.
- Có thể nâng cấp lưu trữ bằng CSDL thật như MongoDB hoặc SQLite.

---

## Liên hệ

Tác giả: [Đặng Văn Thanh]
