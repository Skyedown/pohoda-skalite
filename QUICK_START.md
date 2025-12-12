# Quick Start Guide

Get Pizza Pohoda running on your Ubuntu server in 5 minutes.

## Prerequisites

- Fresh Ubuntu server (20.04 or newer)
- Root/sudo access
- Domain name (optional, for HTTPS)

## Installation Steps

### 1. Connect to your server

```bash
ssh root@your-server-ip
```

### 2. Install Docker (one command)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
```

### 3. Install Docker Compose

```bash
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose
```

### 4. Upload your project

```bash
# From your local machine
scp -r /path/to/pizza-pohoda-c root@your-server-ip:/opt/pizza-pohoda

# Or clone from git
cd /opt
git clone your-repo-url pizza-pohoda
```

### 5. Configure environment

```bash
cd /opt/pizza-pohoda
cp api/.env.example api/.env
nano api/.env
```

Add your configuration:
```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@pizzapohoda.sk
RESTAURANT_EMAIL=your@email.com
```

Save and exit (Ctrl+X, Y, Enter)

### 6. Start the application

```bash
./start.sh
```

That's it! Your application is now running at `http://your-server-ip`

## Quick Commands

### Start
```bash
./start.sh
```

### Stop
```bash
./stop.sh
```

### View Logs
```bash
docker-compose logs -f
```

### Restart
```bash
docker-compose restart
```

### Update Application
```bash
git pull
docker-compose up -d --build
```

## Setup Firewall (Recommended)

```bash
apt install -y ufw
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

## Setup HTTPS (Recommended)

```bash
# Install Certbot
apt install -y certbot

# Stop frontend temporarily
docker-compose stop frontend

# Get certificate
certbot certonly --standalone -d yourdomain.com

# Update docker-compose.yml to mount certificates
# See DOCKER_SETUP.md for detailed HTTPS instructions

# Restart
docker-compose up -d
```

## Troubleshooting

### Check if containers are running
```bash
docker-compose ps
```

### View all logs
```bash
docker-compose logs
```

### Restart everything
```bash
docker-compose down
docker-compose up -d --build
```

### Port 80 already in use
```bash
# Find what's using it
sudo lsof -i :80

# Stop it
sudo systemctl stop apache2  # if Apache
sudo systemctl stop nginx    # if Nginx
```

## Need More Help?

📖 Read the complete guide: [DOCKER_SETUP.md](DOCKER_SETUP.md)

## Summary

✅ Docker installed
✅ Application deployed
✅ Running on port 80
✅ API on port 3001
✅ Firewall configured
✅ Ready to serve customers!

Your pizza ordering system is live! 🍕
