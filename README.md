# Project Setup

Full-stack application với NestJS backend và Next.js frontend.

## Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- PostgreSQL (hoặc sử dụng Docker)

## Cài đặt

### 1. Clone và cài đặt dependencies

```bash
# Cài đặt backend
cd backend
npm install

# Cài đặt frontend
cd ../frontend
npm install
```

### 2. Cấu hình môi trường

```bash
# Backend - tạo file .env từ env.example
cd backend
cp env.example .env
# Chỉnh sửa .env với thông tin database của bạn
```

### 3. Setup Database

```bash
# Chạy migrations
cd backend
npx prisma migrate dev
```

## Chạy ứng dụng

### Cách 1: Chạy riêng lẻ (khuyến nghị)

Mở 2 terminal riêng biệt:

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev
```

```bash
# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Cách 2: Chạy cùng lúc với Docker Compose

```bash
docker-compose up
```

### Cách 3: Chạy trong một terminal (Windows)

```bash
cd backend ; npm run start:dev & cd ../frontend ; npm run dev
```

## URLs

- Frontend: http://localhost:3003
- Backend API: http://localhost:3000
- Backend API Docs: http://localhost:3000/api (nếu có Swagger)

## Scripts hữu ích

### Backend

```bash
cd backend

# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Database
npx prisma studio          # Mở Prisma Studio
npx prisma migrate dev     # Chạy migrations
npx prisma generate        # Generate Prisma Client

# Testing
npm run test
npm run test:e2e
```

### Frontend

```bash
cd frontend

# Development
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

## Cấu trúc thư mục

```
.
├── backend/          # NestJS API
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/         # Next.js App
│   ├── src/
│   └── package.json
└── docker-compose.yml
```

## Troubleshooting

### Port đã được sử dụng

```bash
# Windows - kill process trên port
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc thay đổi port trong package.json
```

### Database connection error

- Kiểm tra PostgreSQL đang chạy
- Xác nhận DATABASE_URL trong .env đúng
- Chạy lại migrations: `npx prisma migrate dev`
