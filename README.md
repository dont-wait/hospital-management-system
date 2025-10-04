# 🏥 Hospital Management System

Hệ thống quản lý bệnh viện hiện đại được xây dựng với Clean Architecture, sử dụng .NET 8 cho backend và Next.js cho frontend.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Tính năng](#tính-năng)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Tổng quan

Hospital Management System là một ứng dụng web toàn diện được thiết kế để quản lý các hoạt động của bệnh viện một cách hiệu quả. Hệ thống hỗ trợ quản lý bệnh nhân, bác sĩ, lịch hẹn và các dịch vụ y tế khác.

### Đặc điểm nổi bật

- ✅ Clean Architecture với SOLID principles
- ✅ RESTful API với JWT Authentication
- ✅ Real-time notifications với SignalR
- ✅ Responsive design cho mọi thiết bị
- ✅ Docker containerization
- ✅ Redis caching cho performance tối ưu
- ✅ SQL Server database với Entity Framework Core

## 🏗️ Kiến trúc hệ thống

Dự án được xây dựng theo mô hình **Clean Architecture** với các lớp sau:

```text
Backend (Clean Architecture)
├── WebApi (Presentation Layer)
├── Application (Application Layer)
├── Domain (Domain Layer)
└── Infrastructure (Infrastructure Layer)

Frontend (Next.js)
├── Components (UI Components)
├── Pages (Routing)
├── Services (API Integration)
├── Contexts (State Management)
└── Hooks (Custom React Hooks)
```

## 🛠️ Công nghệ sử dụng

### Backend

- **Framework**: .NET 8.0
- **Database**: SQL Server 2022
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Token
- **Caching**: Redis
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

### Frontend

- **Framework**: Next.js 15.5.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Management**: React Hook Form + Zod
- **HTTP Client**: Axios
- **State Management**: React Context

### DevOps & Tools

- **Container**: Docker & Docker Compose
- **Database**: SQL Server in Docker
- **Cache**: Redis in Docker

## ✨ Tính năng

### 🔐 Xác thực & Phân quyền

- Đăng nhập/Đăng ký cho bệnh nhân
- Quản lý tài khoản bác sĩ (Admin only)
- JWT Authentication với Refresh Token
- Phân quyền dựa trên vai trò (Admin, Doctor, Patient)
- Quên mật khẩu với OTP verification

### 👥 Quản lý người dùng

- **Bệnh nhân**: Đăng ký, cập nhật thông tin cá nhân
- **Bác sĩ**: Quản lý hồ sơ, chuyên khoa
- **Admin**: Quản lý toàn bộ hệ thống

### 📱 Giao diện người dùng

- Responsive design
- Dark/Light theme support
- Loading states và error handling
- Form validation với real-time feedback
- Toast notifications

### 🔒 Bảo mật

- Password hashing với bcrypt
- JWT token với expiration
- Rate limiting
- CORS configuration
- Input validation & sanitization

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- .NET 8.0 SDK
- Node.js 18+ và npm/yarn
- Docker và Docker Compose
- SQL Server (hoặc Docker container)

### 1. Clone repository

```bash
git clone https://github.com/dont-wait/hospital-management-system.git
cd hospital-management-system
```

### 2. Cài đặt Backend

```bash
cd server

# Restore dependencies
dotnet restore

# Cài đặt database với Docker
docker-compose up -d

# Run migrations
dotnet ef database update --project Infrastructure --startup-project WebApi

# Run the API
dotnet run --project WebApi
```

Backend sẽ chạy tại: `https://localhost:5001`

### 3. Cài đặt Frontend

```bash
cd client

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 4. Chạy với Docker (Recommended)

```bash
# Từ thư mục server
docker-compose up -d

# Build và run backend
dotnet run --project WebApi

# Từ thư mục client
npm run dev
```

## 📁 Cấu trúc dự án

### Backend Structure

```text
server/
├── WebApi/                 # API Controllers, Middleware
│   ├── Controllers/        # API Endpoints
│   ├── Services/          # Application Services
│   └── Program.cs         # Application Entry Point
├── Application/           # Business Logic Layer
│   ├── Common/           # Shared DTOs, Interfaces
│   └── Services/         # Application Services
├── Domain/               # Domain Entities & Business Rules
│   ├── Entities/         # Domain Models
│   └── Enums/           # Domain Enumerations
└── Infrastructure/       # Data Access & External Services
    ├── Persistence/      # Database Context & Repositories
    ├── Services/        # External Service Implementations
    └── Migrations/      # EF Core Migrations
```

### Frontend Structure

```text
client/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/      # Authentication Routes
│   │   └── (user)/      # User Dashboard Routes
│   ├── components/       # Reusable UI Components
│   │   └── ui/          # Base UI Components
│   ├── contexts/        # React Context Providers
│   ├── hooks/           # Custom React Hooks
│   ├── services/        # API Service Layer
│   ├── schemas/         # Zod Validation Schemas
│   └── types/           # TypeScript Type Definitions
```

## 📚 API Documentation

API documentation được tự động tạo bằng Swagger và có thể truy cập tại:
`https://localhost:5001/swagger`

### Main Endpoints

#### Authentication

```http
POST /login                 # User login
POST /patient/register      # Patient registration
POST /doctor/register       # Doctor registration (Admin only)
POST /logout               # User logout
POST /request-reset        # Request password reset
POST /verify-otp          # Verify OTP
POST /reset-password      # Reset password
```

#### User Management

```http
GET  /api/users           # Get all users (Admin only)
GET  /api/users/{id}      # Get user by ID
PUT  /api/users/{id}      # Update user
DELETE /api/users/{id}    # Delete user (Admin only)
```

## 🗄️ Database Schema

### Core Entities

#### UserAccount

- Id, CitizenID (unique)
- Password (hashed)
- AvatarUrl, Is_Active
- Created/Updated timestamps

#### Patient

- Personal information (Name, Phone, Email)
- Medical history references
- Relationship with UserAccount

#### Employee & Doctor

- Professional information
- Specialization (for doctors)
- Certification details
- Role-based permissions

### Relationships

- UserAccount → Patient (1:0..1)
- UserAccount → Employee (1:0..1)
- Employee → Doctor (1:0..1)
- Role-based authorization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow Clean Architecture principles
- Write unit tests for new features
- Follow coding standards (C# và TypeScript)
- Update documentation khi cần thiết

## 📝 Environment Variables

### Backend (.NET)

```env
ConnectionStrings__DefaultConnection=Server=localhost;Database=HospitalDB;Trusted_Connection=true;
JWT__SecretKey=your-secret-key
JWT__Issuer=your-issuer
JWT__Audience=your-audience
Redis__ConnectionString=localhost:6379
```

### Frontend (Next.js)

```env
NEXT_PUBLIC_API_URL=https://localhost:5001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🐛 Known Issues & TODO

### Current Issues

- [ ] Email service integration pending
- [ ] File upload for avatars
- [ ] Advanced search functionality

### Planned Features

- [ ] Appointment scheduling system
- [ ] Medical records management
- [ ] Prescription management
- [ ] Report generation
- [ ] Mobile app development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Developer**: Clean Architecture, .NET 8, SQL Server
- **Frontend Developer**: Next.js, TypeScript, Tailwind CSS
- **DevOps**: Docker, CI/CD Pipeline

## 📞 Contact

Project Link: [https://github.com/dont-wait/hospital-management-system](https://github.com/dont-wait/hospital-management-system)

---

⭐ Nếu dự án này hữu ích, hãy star repository để ủng hộ nhóm phát triển!