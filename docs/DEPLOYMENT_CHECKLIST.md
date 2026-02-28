# Deployment Checklist

## Pre-Deployment

### Code & Configuration
- [ ] All features tested locally
- [ ] All tests passing
- [ ] No console.log in production code
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Docker images build successfully

### Security
- [ ] Change JWT_SECRET (min 32 chars, random)
- [ ] Change database passwords
- [ ] Change Redis password
- [ ] SEPAY_WEBHOOK_SECRET configured
- [ ] No secrets in git repository
- [ ] .env files in .gitignore

### AWS Setup
- [ ] EC2 instance created
- [ ] Security groups configured
- [ ] Elastic IP attached (optional)
- [ ] Domain purchased/configured
- [ ] SSL certificate ready

---

## Deployment Steps

### 1. Server Setup
```bash
# SSH to server
ssh -i your-key.pem ubuntu@your-server-ip

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
```

- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] User added to docker group

### 2. Code Deployment
```bash
# Clone repository
git clone https://github.com/yourusername/primeacc.git
cd primeacc

# Create production env
cp .env.production.example .env.production
nano .env.production
```

- [ ] Repository cloned
- [ ] .env.production created
- [ ] All environment variables filled

### 3. Environment Variables

Check `.env.production` has:

```env
# Database
POSTGRES_PASSWORD=strong_password_here ✓
POSTGRES_DB=primeacc ✓

# Redis
REDIS_PASSWORD=strong_password_here ✓

# Backend
JWT_SECRET=min_32_chars_random_string ✓
NEXT_PUBLIC_API_URL=https://api.yourdomain.com ✓

# Sepay
SEPAY_API_KEY=sp_live_your_key ✓
SEPAY_WEBHOOK_SECRET=your_webhook_secret ✓

# Bank
BANK_ACCOUNT_NUMBER=101877183706 ✓
BANK_ACCOUNT_NAME=YOUR NAME ✓
```

- [ ] All required variables set
- [ ] Passwords are strong
- [ ] URLs are correct
- [ ] Bank info is correct

### 4. Build & Start
```bash
# Build and start
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

- [ ] All containers running
- [ ] No errors in logs
- [ ] Database migrations applied
- [ ] Backend responding
- [ ] Frontend responding

### 5. Domain & SSL

#### Option A: Nginx + Certbot
```bash
# Install Nginx & Certbot
sudo apt install nginx certbot python3-certbot-nginx -y

# Configure Nginx
sudo nano /etc/nginx/sites-available/primeacc

# Enable site
sudo ln -s /etc/nginx/sites-available/primeacc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

- [ ] Nginx installed
- [ ] Nginx configured
- [ ] SSL certificates obtained
- [ ] Auto-renewal enabled

#### Option B: AWS Load Balancer
- [ ] Target groups created
- [ ] Load balancer created
- [ ] SSL certificate from ACM
- [ ] DNS records updated

### 6. DNS Configuration

Update DNS records:

```
Type    Name    Value                   TTL
A       @       your-server-ip          300
A       api     your-server-ip          300
A       www     your-server-ip          300
```

- [ ] DNS records created
- [ ] DNS propagated (check with `dig yourdomain.com`)

### 7. Sepay Configuration

Vào Sepay Dashboard → Webhook:

```
URL: https://api.yourdomain.com/payment/sepay/webhook
API Key: <your_SEPAY_WEBHOOK_SECRET>
Content Type: application/json
```

- [ ] Webhook URL updated
- [ ] API Key matches .env
- [ ] Test webhook successful

---

## Post-Deployment Testing

### Backend API
```bash
# Health check
curl https://api.yourdomain.com

# Test auth
curl -X POST https://api.yourdomain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

- [ ] Backend accessible
- [ ] Auth working
- [ ] Database connected

### Frontend
```bash
# Check frontend
curl https://yourdomain.com
```

- [ ] Frontend accessible
- [ ] Can login
- [ ] Pages load correctly

### Deposit Feature
```bash
# Test QR generation
curl -X GET "https://api.yourdomain.com/payment/deposit/qr?amount=100000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test webhook
curl -X POST "https://api.yourdomain.com/payment/sepay/webhook" \
  -H "Content-Type: application/json" \
  -H "Authorization: Apikey YOUR_WEBHOOK_SECRET" \
  -d '{"transaction_id":"TEST1","amount":10000,"content":"NAP ABC123XY"}'
```

- [ ] QR generation works
- [ ] Webhook responds 200 OK
- [ ] Test deposit successful

### Full User Flow
1. [ ] Register new account
2. [ ] Login
3. [ ] Navigate to deposit page
4. [ ] Generate QR code
5. [ ] Make real transfer (small amount)
6. [ ] Balance updates within 3 minutes
7. [ ] Transaction appears in history

---

## Monitoring Setup

### Logs
```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# Save logs to file
docker-compose -f docker-compose.prod.yml logs > logs.txt
```

- [ ] Can view logs
- [ ] No critical errors

### Backups
```bash
# Create backup script
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec primeacc_postgres pg_dump -U postgres primeacc > backup_$DATE.sql
# Optional: Upload to S3
# aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

```bash
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/ubuntu/primeacc/backup.sh
```

- [ ] Backup script created
- [ ] Cron job configured
- [ ] Test backup works

### Auto-restart
```bash
# Add to crontab (check every 5 minutes)
*/5 * * * * cd /home/ubuntu/primeacc && docker-compose -f docker-compose.prod.yml up -d
```

- [ ] Auto-restart configured

---

## Security Hardening

### Firewall
```bash
# Enable UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

- [ ] Firewall enabled
- [ ] Only necessary ports open

### SSH
```bash
# Disable password auth
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

- [ ] SSH key-only access
- [ ] Root login disabled

### Updates
```bash
# Enable auto-updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

- [ ] Auto-updates enabled

---

## Performance Optimization

### Docker
```bash
# Prune unused images
docker system prune -a

# Optimize logs
# Add to docker-compose.prod.yml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

- [ ] Unused images removed
- [ ] Log rotation configured

### Database
```bash
# Optimize PostgreSQL
docker exec -it primeacc_postgres psql -U postgres -d primeacc

# Run VACUUM
VACUUM ANALYZE;

# Check indexes
\di
```

- [ ] Database optimized
- [ ] Indexes created

---

## Rollback Plan

If something goes wrong:

```bash
# Stop containers
docker-compose -f docker-compose.prod.yml down

# Restore from backup
docker exec -i primeacc_postgres psql -U postgres -d primeacc < backup_YYYYMMDD.sql

# Revert code
git checkout previous-commit
docker-compose -f docker-compose.prod.yml up -d --build
```

- [ ] Backup available
- [ ] Rollback tested

---

## Final Checks

- [ ] All services running
- [ ] HTTPS working
- [ ] Sepay webhook working
- [ ] Can create account
- [ ] Can login
- [ ] Can deposit money
- [ ] Balance updates correctly
- [ ] Logs are clean
- [ ] Backups working
- [ ] Monitoring setup
- [ ] Documentation updated

---

## Support Contacts

- **AWS Support:** https://console.aws.amazon.com/support
- **Sepay Support:** support@sepay.vn
- **Domain Registrar:** [Your registrar]

---

## Maintenance Schedule

- **Daily:** Check logs for errors
- **Weekly:** Review backups
- **Monthly:** Security updates
- **Quarterly:** Performance review

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Server IP:** _______________  
**Domain:** _______________  
**Notes:** _______________
