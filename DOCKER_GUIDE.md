# Hướng dẫn Chạy PrimeAcc với Docker

## Yêu cầu

- Docker Desktop for Windows
- Ít nhất 4GB RAM available
- 10GB disk space

## Cài đặt Docker Desktop

1. Download Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Cài đặt và khởi động Docker Desktop
3. Đợi Docker Desktop start (icon màu xanh ở system tray)

## Kiểm tra Docker

Mở CMD và chạy:
```cmd
docker --version
docker-compose --version
```

Kết quả mong đợi:
```
Docker version 24.0.x
Docker Compose version v2.x.x
```

---

## 🚀 Cách 1: Chạy với file .bat (Dễ nhất)

### Bước 1: Start containers

Double-click vào file:
```
docker-start.bat
```

Hoặc mở CMD:
```cmd
docker-start.bat
```

### Bước 2: Đợi containers start

Bạn sẽ thấy:
```
Creating primeacc_postgres ... done
Creating primeacc_redis    ... done
Creating primeacc_backend  ... done
Creating primeacc_frontend ... done
```

### Bước 3: Kiểm tra logs

Containers sẽ hiển thị logs real-time. Đợi đến khi thấy:

**Backend:**
```
[Nest] LOG [NestApplication] Nest application successfully started
Backend is running on: http://[::1]:3000
```

**Frontend:**
```
▲ Next.js 16.1.6
- Local:        http://localhost:3003
✓ Ready in 2.5s
```

### Bước 4: Truy cập ứng dụng

- Frontend: http://localhost:3003
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Bước 5: Stop containers

Nhấn `Ctrl+C` trong terminal, hoặc double-click:
```
docker-stop.bat
```

---

## 🚀 Cách 2: Chạy với Docker Compose commands

### Start containers (detached mode)

```cmd
docker-compose up -d
```

### Xem logs

```cmd
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ frontend
docker-compose logs -f frontend
```

### Stop containers

```cmd
docker-compose down
```

### Restart containers

```cmd
docker-compose restart
```

---

## 📊 Quản lý Containers

### Xem status

```cmd
docker-compose ps
```

Kết quả:
```
NAME                  STATUS    PORTS
primeacc_postgres     Up        0.0.0.0:5432->5432/tcp
primeacc_redis        Up        0.0.0.0:6379->6379/tcp
primeacc_backend      Up        0.0.0.0:3000->3000/tcp
primeacc_frontend     Up        0.0.0.0:3003->3003/tcp
```

### Exec vào container

```cmd
# Backend
docker exec -it primeacc_backend sh

# Frontend
docker exec -it primeacc_frontend sh

# PostgreSQL
docker exec -it primeacc_postgres psql -U postgres -d primeacc
```

### Xem logs real-time

```cmd
docker-compose logs -f backend
```

---

## 🗄️ Database Management

### Chạy migrations

```cmd
docker exec -it primeacc_backend npx prisma migrate dev
```

### Prisma Studio (Database GUI)

```cmd
docker exec -it primeacc_backend npx prisma studio
```

Truy cập: http://localhost:5555

### Seed database (nếu có)

```cmd
docker exec -it primeacc_backend npx prisma db seed
```

### Reset database

```cmd
docker exec -it primeacc_backend npx prisma migrate reset
```

---

## 🔧 Troubleshooting

### Lỗi: Port already in use

**Giải pháp 1: Kill process đang dùng port**

```cmd
# Tìm process trên port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

**Giải pháp 2: Đổi port trong docker-compose.yml**

```yaml
backend:
  ports:
    - "3001:3000"  # Đổi 3000 thành 3001
```

### Lỗi: Cannot connect to Docker daemon

1. Mở Docker Desktop
2. Đợi Docker start (icon xanh)
3. Chạy lại command

### Lỗi: Container keeps restarting

Xem logs để debug:
```cmd
docker-compose logs backend
```

Thường gặp:
- Database connection failed → Check PostgreSQL container
- Redis connection failed → Check Redis container
- Port conflict → Đổi port

### Lỗi: Out of disk space

Clean up Docker:
```cmd
docker system prune -a --volumes
```

⚠️ Warning: Sẽ xóa tất cả containers, images, và volumes không dùng!

### Lỗi: Build failed

Rebuild từ đầu:
```cmd
docker-compose build --no-cache
docker-compose up
```

---

## 🔄 Development Workflow

### Hot reload

Cả backend và frontend đều có hot reload:
- Sửa code trong `backend/src/` → Backend tự restart
- Sửa code trong `frontend/src/` → Frontend tự rebuild

### Install new package

**Backend:**
```cmd
# Stop containers
docker-compose down

# Install package locally
cd backend
npm install <package-name>

# Rebuild and start
docker-compose up --build backend
```

**Frontend:**
```cmd
# Stop containers
docker-compose down

# Install package locally
cd frontend
npm install <package-name>

# Rebuild and start
docker-compose up --build frontend
```

### Run tests

```cmd
# Backend tests
docker exec -it primeacc_backend npm run test

# Frontend tests
docker exec -it primeacc_frontend npm run test
```

---

## 🧹 Cleanup

### Stop và xóa containers

```cmd
docker-compose down
```

### Xóa containers + volumes (data sẽ mất)

```cmd
docker-compose down -v
```

### Xóa tất cả (containers + images + volumes)

Double-click:
```
docker-clean.bat
```

Hoặc:
```cmd
docker-compose down -v --rmi all
```

---

## 📝 Docker Compose Services

### PostgreSQL
- Image: `postgres:15-alpine`
- Port: `5432`
- User: `postgres`
- Password: `postgres`
- Database: `primeacc`
- Volume: `postgres_data`

### Redis
- Image: `redis:7-alpine`
- Port: `6379`
- Volume: `redis_data`

### Backend
- Build: `backend/Dockerfile.dev`
- Port: `3000`
- Hot reload: ✅
- Depends on: PostgreSQL, Redis

### Frontend
- Build: `frontend/Dockerfile.dev`
- Port: `3003`
- Hot reload: ✅
- Depends on: Backend

---

## 🔐 Environment Variables

Được định nghĩa trong `docker-compose.yml`:

**Backend:**
```yaml
- NODE_ENV=development
- PORT=3000
- DATABASE_URL=postgresql://postgres:postgres@postgres:5432/primeacc
- JWT_SECRET=primeacc-super-secret-jwt-key
- REDIS_HOST=redis
- REDIS_PORT=6379
```

**Frontend:**
```yaml
- NODE_ENV=development
- NEXT_PUBLIC_API_URL=http://localhost:3000
```

Để thay đổi, edit `docker-compose.yml` và restart containers.

---

## 📊 Monitoring

### Docker Desktop Dashboard

1. Mở Docker Desktop
2. Click vào "Containers" tab
3. Xem status, logs, stats của từng container

### Resource usage

```cmd
docker stats
```

Hiển thị CPU, Memory, Network usage real-time.

---

## 🚀 Production Deployment

Để deploy production, sử dụng Dockerfile (không phải Dockerfile.dev):

```cmd
docker-compose -f docker-compose.prod.yml up -d
```

Cần tạo `docker-compose.prod.yml` với:
- Build từ Dockerfile (không phải .dev)
- Không mount volumes (code đã được build vào image)
- Set NODE_ENV=production
- Use secrets cho sensitive data

---

## ✅ Checklist

- [ ] Docker Desktop đã được cài đặt và chạy
- [ ] Đã chạy `docker-compose up` thành công
- [ ] Backend accessible tại http://localhost:3000
- [ ] Frontend accessible tại http://localhost:3003
- [ ] Database migrations đã chạy
- [ ] Không có lỗi trong logs

---

## 🆘 Support

Nếu gặp vấn đề:

1. Check Docker Desktop đang chạy
2. Check logs: `docker-compose logs -f`
3. Restart containers: `docker-compose restart`
4. Rebuild: `docker-compose up --build`
5. Clean và rebuild: `docker-compose down -v && docker-compose up --build`

---

## 📚 Useful Commands Cheat Sheet

```cmd
# Start
docker-compose up
docker-compose up -d                    # Detached mode

# Stop
docker-compose down
docker-compose down -v                  # Remove volumes

# Logs
docker-compose logs -f
docker-compose logs -f backend

# Rebuild
docker-compose build
docker-compose up --build

# Exec
docker exec -it primeacc_backend sh
docker exec -it primeacc_postgres psql -U postgres

# Status
docker-compose ps
docker stats

# Clean
docker system prune -a --volumes
```

---

**Docker setup hoàn tất! Chỉ cần double-click `docker-start.bat` để bắt đầu!** 🎉
