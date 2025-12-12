[![Deploy Hospital API to Azure (Student)](https://github.com/dont-wait/hospital-management-system/actions/workflows/deployapi.yml/badge.svg)](https://github.com/dont-wait/hospital-management-system/actions/workflows/deployapi.yml)
# 🏥 Hospital Management System

Hệ thống quản lý bệnh viện được xây dựng với .NET 8 và Next.js.

## 🚀 Cách chạy dự án với Docker

### Bước 1: Chuẩn bị

```bash
# Clone dự án
git clone https://github.com/dont-wait/hospital-management-system.git
cd hospital-management-system

# Copy và chỉnh sửa file môi trường
copy .env.example .env
```

### Bước 2: Cấu hình .env

Mở file `.env` và thay đổi mật khẩu (nếu muốn):

```env
SQLSERVER_PASSWORD=YourStrong@Password123
REDIS_PASSWORD=YourRedisPassword123
JWT_SECRET_KEY=Your-Super-Secret-Key-Min-32-Characters-Long-12345678
```

### Bước 3: Khởi động Docker

```bash
docker-compose up -d --build
```

### Bước 4: Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger

### Tài khoản mặc định

- **Admin**: admin@hospital.com / Admin@123
- **Doctor**: doctor@hospital.com / Doctor@123
- **Patient**: patient@hospital.com / Patient@123

## 🛑 Dừng hệ thống

```bash
# Dừng containers
docker-compose stop

# Dừng và xóa containers
docker-compose down

# Xóa cả data (database, cache)
docker-compose down -v
```

## 📋 Kiểm tra logs

```bash
# Xem tất cả logs
docker-compose logs -f

# Xem log từng service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f sqlserver
docker-compose logs -f redis
```

## 🔧 Xử lý lỗi

### Port đã được sử dụng
```bash
# Kiểm tra process đang dùng port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process (thay <PID> bằng số process ID)
taskkill /PID <PID> /F
```

### Khởi động lại services
```bash
docker-compose restart
```

### Xem trạng thái containers
```bash
docker-compose ps
```

## 📖 Hướng dẫn chi tiết

Xem file [DOCKER-GUIDE.md](./DOCKER-GUIDE.md) để biết thêm:
- Các lệnh Docker nâng cao
- Troubleshooting chi tiết
- Production deployment
- Backup và restore
- Security best practices

## 🛠️ Tech Stack

### Backend
- .NET 8.0
- SQL Server 2022
- Redis Cache
- Entity Framework Core
- JWT Authentication

### Frontend
- Next.js 16
- TypeScript
- Tailwind CSS
- React Hook Form
- Axios

## 📁 Cấu trúc dự án

```
hospital-management-system/
├── client/              # Frontend (Next.js)
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/
├── server/              # Backend (.NET)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── docker-compose.yml  # DB + Redis local
│   ├── WebApi/
│   ├── Application/
│   ├── Domain/
│   └── Infrastructure/
├── docker-compose.yml   # Full stack
├── .env.example        # Environment template
└── DOCKER-GUIDE.md     # Hướng dẫn chi tiết
```

## 📦 Files cần thiết để chạy Docker

- `docker-compose.yml` - Cấu hình toàn bộ hệ thống
- `.env` - Biến môi trường (copy từ .env.example)
- `client/Dockerfile` - Build Frontend
- `client/.dockerignore` - Loại trừ files không cần
- `server/Dockerfile` - Build Backend
- `server/.dockerignore` - Loại trừ files không cần

## 📞 Yêu cầu hệ thống

- Docker Desktop >= 20.10
- RAM tối thiểu: 4GB
- Dung lượng: 10GB

## 📄 License

MIT License
