# AWS Deployment Guide

## Tổng quan

Deploy PrimeAcc lên AWS với các services:
- **EC2**: Chạy Docker containers
- **RDS**: PostgreSQL database (optional, có thể dùng container)
- **ElastiCache**: Redis (optional, có thể dùng container)
- **Route 53**: DNS management
- **Certificate Manager**: SSL certificates
- **Application Load Balancer**: Load balancing & SSL termination

## Option 1: EC2 với Docker (Recommended cho bắt đầu)

### Bước 1: Tạo EC2 Instance

1. **Launch EC2 Instance:**
   - AMI: Ubuntu Server 22.04 LTS
   - Instance type: t3.medium (2 vCPU, 4GB RAM) hoặc t3.small để tiết kiệm
   - Storage: 30GB gp3
   - Security Group: Mở ports 80, 443, 22

2. **Security Group Rules:**
```
Type            Protocol    Port Range    Source
SSH             TCP         22            Your IP
HTTP            TCP         80            0.0.0.0/0
HTTPS           TCP         443           0.0.0.0/0
Custom TCP      TCP         3000          0.0.0.0/0 (Frontend)
Custom TCP      TCP         3001          0.0.0.0/0 (Backend API)
```

### Bước 2: Connect và Setup Server

```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version

# Logout and login again for docker group to take effect
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Bước 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/primeacc.git
cd primeacc

# Create production env file
cp .env.production.example .env.production
nano .env.production
```

**Điền thông tin vào `.env.production`:**
```env
POSTGRES_PASSWORD=strong_password_here
REDIS_PASSWORD=strong_password_here
JWT_SECRET=super_secret_jwt_key_min_32_chars
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
SEPAY_API_KEY=sp_live_your_key
SEPAY_WEBHOOK_SECRET=your_webhook_secret
BANK_ACCOUNT_NUMBER=101877183706
BANK_ACCOUNT_NAME=YOUR NAME
```

```bash
# Build and start containers
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Bước 4: Setup Domain & SSL

#### Option A: Dùng Nginx trên EC2

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/primeacc
```

**Nginx config:**
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/primeacc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

#### Option B: Dùng AWS Application Load Balancer

1. **Create Target Groups:**
   - Backend: Port 3001
   - Frontend: Port 3000

2. **Create Application Load Balancer:**
   - Listeners: HTTP (80) → HTTPS (443)
   - SSL Certificate: From ACM

3. **Configure Rules:**
   - `api.yourdomain.com` → Backend target group
   - `yourdomain.com` → Frontend target group

### Bước 5: Cấu hình Sepay Webhook

Vào Sepay Dashboard → Webhook:

```
URL: https://api.yourdomain.com/payment/sepay/webhook
API Key: <your_SEPAY_WEBHOOK_SECRET>
```

### Bước 6: Test Deployment

```bash
# Test backend
curl https://api.yourdomain.com

# Test frontend
curl https://yourdomain.com

# Test webhook
curl -X POST "https://api.yourdomain.com/payment/sepay/webhook" \
  -H "Content-Type: application/json" \
  -H "Authorization: Apikey YOUR_SECRET" \
  -d '{"transaction_id":"TEST1","amount":10000,"content":"NAP ABC123XY"}'
```

---

## Option 2: AWS ECS (Elastic Container Service)

### Bước 1: Push Images to ECR

```bash
# Login to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com

# Create repositories
aws ecr create-repository --repository-name primeacc-backend
aws ecr create-repository --repository-name primeacc-frontend

# Build and push backend
cd backend
docker build -t primeacc-backend .
docker tag primeacc-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/primeacc-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/primeacc-backend:latest

# Build and push frontend
cd ../frontend
docker build -t primeacc-frontend .
docker tag primeacc-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/primeacc-frontend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/primeacc-frontend:latest
```

### Bước 2: Create ECS Cluster

1. Go to ECS Console
2. Create Cluster (Fargate)
3. Create Task Definitions for backend & frontend
4. Create Services
5. Configure Load Balancer

---

## Option 3: AWS Lightsail (Easiest & Cheapest)

### Bước 1: Create Lightsail Instance

1. Go to Lightsail Console
2. Create Instance:
   - OS: Ubuntu 22.04
   - Plan: $10/month (2GB RAM)
   - Enable static IP

### Bước 2: Deploy

```bash
# SSH to Lightsail
ssh ubuntu@your-lightsail-ip

# Follow same steps as EC2 Option 1
```

---

## Database Options

### Option A: PostgreSQL in Docker (Simplest)

Đã có trong `docker-compose.prod.yml`

**Pros:**
- Đơn giản, không tốn thêm chi phí
- Dễ backup/restore

**Cons:**
- Cần backup thủ công
- Không có auto-scaling

### Option B: AWS RDS PostgreSQL (Recommended for Production)

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier primeacc-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20

# Update .env.production
DATABASE_URL=postgresql://postgres:PASSWORD@primeacc-db.xxxxx.ap-southeast-1.rds.amazonaws.com:5432/primeacc
```

**Pros:**
- Auto backups
- High availability
- Auto scaling
- Managed service

**Cons:**
- Chi phí cao hơn (~$15/month)

---

## Monitoring & Maintenance

### Setup Monitoring

```bash
# Install monitoring tools
docker run -d \
  --name=cadvisor \
  --restart=always \
  -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  gcr.io/cadvisor/cadvisor:latest
```

### Backup Database

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec primeacc_postgres pg_dump -U postgres primeacc > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### Auto-restart on failure

```bash
# Add to crontab
crontab -e

# Add this line to check every 5 minutes
*/5 * * * * cd /home/ubuntu/primeacc && docker-compose -f docker-compose.prod.yml up -d
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 backend
```

---

## Cost Estimation

### Option 1: EC2 + Docker
- EC2 t3.small: $15/month
- Elastic IP: Free (if attached)
- Storage (30GB): $3/month
- **Total: ~$18/month**

### Option 2: Lightsail
- $10/month plan (2GB RAM)
- Includes: 2TB transfer, static IP
- **Total: $10/month**

### Option 3: ECS Fargate
- Fargate: ~$30/month
- RDS t3.micro: ~$15/month
- ElastiCache: ~$15/month
- **Total: ~$60/month**

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (min 32 chars)
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (Security Groups)
- [ ] Enable database encryption
- [ ] Setup automated backups
- [ ] Use environment variables (never commit secrets)
- [ ] Enable CloudWatch logging
- [ ] Setup monitoring alerts
- [ ] Regular security updates

---

## Quick Deploy Commands

```bash
# Clone and setup
git clone https://github.com/yourusername/primeacc.git
cd primeacc
cp .env.production.example .env.production
nano .env.production

# Deploy
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart
docker-compose -f docker-compose.prod.yml restart

# Stop
docker-compose -f docker-compose.prod.yml down

# Update code
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Troubleshooting

### Container won't start
```bash
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

### Database connection error
```bash
# Check database is running
docker-compose -f docker-compose.prod.yml ps postgres

# Test connection
docker exec -it primeacc_postgres psql -U postgres -d primeacc
```

### Sepay webhook not working
```bash
# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend | grep -i sepay

# Test webhook manually
curl -X POST "https://api.yourdomain.com/payment/sepay/webhook" \
  -H "Content-Type: application/json" \
  -H "Authorization: Apikey YOUR_SECRET" \
  -d '{"transaction_id":"TEST","amount":10000,"content":"NAP ABC123"}'
```

---

**Recommended:** Bắt đầu với **AWS Lightsail** ($10/month) hoặc **EC2 t3.small** ($15/month) với Docker.
