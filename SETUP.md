# 🚀 Hướng dẫn chạy dự án

## 📦 Yêu cầu cài đặt

### Phần mềm bắt buộc
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **SQL Server** - [Download](https://www.microsoft.com/sql-server/sql-server-downloads) hoặc dùng Docker
- **Redis** (tùy chọn) - Dùng Docker hoặc cài local

### Kiểm tra đã cài đặt
```bash
dotnet --version    # >= 8.0
node --version      # >= 18.0
npm --version       # >= 9.0
```

## ⚡ Chạy Backend (Terminal 1)

### 1. Chuẩn bị Database
```bash
cd server
docker-compose up -d
```

### 2. Cấu hình Backend
Mở `server/WebApi/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "SqlServerDb": "Server=localhost,1433;Database=HospitalManagementDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;",
    "RedisConnection": "localhost:6379,password=YourRedisPassword"
  },
  "JwtSettings": {
    "Issuer": "HospitalManagementSystem",
    "Audience": "HospitalManagementUsers",
    "Key": "Your-Secret-Key-Min-32-Chars-Long",
    "ExpiryMinutes": 60
  }
}
```

### 3. Chạy Migration
```bash
cd server
dotnet restore
dotnet ef database update --project Infrastructure --startup-project WebApi
```

### 4. Chạy API
```bash
cd server/WebApi
dotnet run
```

✅ Backend chạy tại: **http://localhost:5000**
✅ Swagger: **http://localhost:5000/swagger**

---

## 🎨 Chạy Frontend (Terminal 2)

### 1. Cài dependencies
```bash
cd client
npm install
```

### 2. Cấu hình Frontend
Tạo file `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Hospital Management System
```

### 3. Build frontend
```bash
npm run build
```

### 4. Chạy frontend
```bash
npm start
```

✅ Frontend chạy tại: **http://localhost:3000**

---

## 🔑 Tài khoản test

| Role | CCCD | Password |
|------|-------|----------|
| Admin | 000000000001 | Admin@123 |
| Doctor | 010000000001 | Password123! |
| Sys | 000000000002 | SysAdmin@123 |
| Patient | 001090123456 | Conca@123 |

## 🛠️ Tech Stack

### Backend
- **.NET 8.0** - Web API
- **SQL Server 2022** - Database
- **Redis** - Cache
- **Entity Framework Core** - ORM
- **JWT** - Authentication

### Frontend
- **Next.js 16** - React Framework
- **TypeScript** - Language
- **Tailwind CSS v4** - Styling
- **React Hook Form** - Forms
- **Zod** - Validation
- **Axios** - HTTP Client

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Orchestration

## 🔧 Lệnh hữu ích

### Backend
```bash
# Build project
dotnet build

# Restore packages
dotnet restore

# Tạo migration mới
dotnet ef migrations add MigrationName --project Infrastructure --startup-project WebApi

# Run tests
dotnet test
```

### Frontend
```bash
# Build production
npm run build

# Start production
npm start

# Lint code
npm run lint
```

## 📁 Cấu trúc dự án

```
hospital-management-system/
├── client/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/           # Pages & Routes
│   │   ├── components/    # UI Components
│   │   ├── contexts/      # State Management
│   │   ├── services/      # API Calls
│   │   └── styles/        # CSS Modules
## 🐛 Xử lý lỗi

### Port đã dùng
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:5000 | xargs kill -9
```

### Lỗi database connection
- Kiểm tra SQL Server đang chạy
- Kiểm tra connection string đúng chưa
- Thử chạy migration lại

### Lỗi build Frontend
```bash
rm -rf node_modules package-lock.json
npm install
```

### Reset database
```bash
cd server
dotnet ef database drop --project Infrastructure --startup-project WebApi --force
dotnet ef database update --project Infrastructure --startup-project WebApi
```

---

📖 **Chạy với Docker**: Xem [README.md](./README.md) hoặc [DOCKER-GUIDE.md](./DOCKER-GUIDE.md)
docker-compose logs <service-name>
docker-compose restart <service-name>
```

### Reset toàn bộ
```bash
docker-compose down -v
docker-compose up -d --build
```

---

📖 Chi tiết: [README.md](./README.md) | [DOCKER-GUIDE.md](./DOCKER-GUIDE.md)
