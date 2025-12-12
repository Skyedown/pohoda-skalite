# Docker Deployment Guide for Pizza Pohoda

This guide will help you deploy the Pizza Pohoda pizza ordering application on a fresh Ubuntu server using Docker.

## Prerequisites

- A fresh Ubuntu server (20.04 LTS or newer recommended)
- SSH access to the server
- Root or sudo privileges
- Domain name pointed to your server (optional, for HTTPS)

## Step 1: Initial Server Setup

Connect to your Ubuntu server via SSH:

```bash
ssh root@your-server-ip
```

Update the system packages:

```bash
apt update && apt upgrade -y
```

## Step 2: Install Docker and Docker Compose

Install Docker:

```bash
# Install required packages
apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package list
apt update

# Install Docker
apt install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Verify Docker installation
docker --version
```

Install Docker Compose:

```bash
# Download Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

## Step 3: Install Git

```bash
apt install -y git
```

## Step 4: Clone Your Repository

Navigate to the directory where you want to deploy:

```bash
cd /opt
```

Clone your repository (replace with your actual repository URL):

```bash
git clone https://github.com/yourusername/pizza-pohoda.git
cd pizza-pohoda
```

Or if you're uploading files manually via SCP:

```bash
# From your local machine:
scp -r /path/to/pizza-pohoda-c root@your-server-ip:/opt/pizza-pohoda
```

## Step 5: Configure Environment Variables

Create the API environment file:

```bash
cd /opt/pizza-pohoda
nano api/.env
```

Add the following configuration (replace with your actual values):

```env
# Server Configuration
NODE_ENV=production
PORT=3001

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@pizzapohoda.sk

# Restaurant Email
RESTAURANT_EMAIL=pohoda.skalite@example.com
```

Save and exit (Ctrl+X, then Y, then Enter).

## Step 6: Build and Start the Application

Build and start the Docker containers:

```bash
cd /opt/pizza-pohoda
docker-compose up -d --build
```

This will:
1. Build the frontend React application
2. Build the backend API
3. Start both services in the background

Check if containers are running:

```bash
docker-compose ps
```

You should see both `pizza-pohoda-frontend` and `pizza-pohoda-api` running.

Check the logs if needed:

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs frontend
docker-compose logs api
```

## Step 7: Configure Firewall

Allow HTTP and HTTPS traffic:

```bash
# Install UFW if not installed
apt install -y ufw

# Allow SSH (IMPORTANT - do this first!)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

## Step 8: Setup HTTPS with Let's Encrypt (Optional but Recommended)

Install Certbot:

```bash
apt install -y certbot python3-certbot-nginx nginx
```

Stop the Docker frontend container temporarily:

```bash
docker-compose stop frontend
```

Obtain SSL certificate:

```bash
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

Create nginx configuration for HTTPS:

```bash
nano /opt/pizza-pohoda/nginx-ssl.conf
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://api:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Update docker-compose.yml to mount SSL certificates:

```bash
nano docker-compose.yml
```

Update the frontend service:

```yaml
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: pizza-pohoda-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./nginx-ssl.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - api
    networks:
      - pohoda-network
```

Restart the containers:

```bash
docker-compose up -d --build
```

Setup auto-renewal for SSL:

```bash
# Add cron job for certificate renewal
crontab -e

# Add this line (renew certificate twice daily)
0 0,12 * * * certbot renew --quiet && docker-compose restart frontend
```

## Step 9: Verify Deployment

Test the application:

```bash
# Check if frontend is accessible
curl http://localhost

# Check if API is healthy
curl http://localhost/api/health
```

Visit your server IP or domain in a browser to see the application.

## Management Commands

### Start the application:
```bash
cd /opt/pizza-pohoda
docker-compose up -d
```

### Stop the application:
```bash
docker-compose down
```

### Restart the application:
```bash
docker-compose restart
```

### Update the application:
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
```

### View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f api
```

### Clean up old images:
```bash
docker system prune -a
```

## Monitoring

### Check container status:
```bash
docker-compose ps
```

### Check container resource usage:
```bash
docker stats
```

### Check API health:
```bash
curl http://localhost/api/health
```

## Backup

### Backup environment variables:
```bash
cp api/.env api/.env.backup
```

### Backup the entire application:
```bash
cd /opt
tar -czf pizza-pohoda-backup-$(date +%Y%m%d).tar.gz pizza-pohoda/
```

## Troubleshooting

### Container won't start:
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down
docker-compose up -d --build --force-recreate
```

### Port already in use:
```bash
# Check what's using port 80
sudo lsof -i :80

# Kill the process if needed
sudo kill -9 <PID>
```

### Out of disk space:
```bash
# Clean up Docker
docker system prune -a --volumes

# Check disk usage
df -h
```

## Security Recommendations

1. **Keep system updated:**
   ```bash
   apt update && apt upgrade -y
   ```

2. **Use strong passwords for all services**

3. **Regularly backup your data**

4. **Monitor logs for suspicious activity:**
   ```bash
   docker-compose logs | grep -i error
   ```

5. **Setup monitoring (optional):**
   - Consider using tools like Prometheus + Grafana
   - Setup uptime monitoring (e.g., UptimeRobot)

6. **Disable root SSH login:**
   ```bash
   nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   systemctl restart sshd
   ```

## Support

For issues or questions, check the logs first:
```bash
docker-compose logs -f
```

Common issues and solutions are documented in the troubleshooting section above.
