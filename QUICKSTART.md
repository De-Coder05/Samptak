# Quick Start Guide

## 🚀 Deploy Everything in 3 Steps

### Step 1: Ensure Docker is Running
```bash
docker --version
docker-compose --version
```

### Step 2: Deploy
```bash
./deploy.sh
```

### Step 3: Access the Application
- Open your browser and go to: **http://localhost:3000**
- Upload an image to test crack detection

## 🎯 That's It!

The deployment script will:
- ✅ Build Docker images for frontend and backend
- ✅ Start all services
- ✅ Verify everything is running

## 📊 Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop everything
./stop.sh

# Restart everything
./restart.sh

# Check service status
docker-compose ps
```

## 🐛 Troubleshooting

**Ports already in use?**
- Edit `docker-compose.yml` and change the port mappings

**Services not starting?**
- Check logs: `docker-compose logs`
- Ensure Docker has enough resources (4GB+ RAM recommended)

**Frontend can't connect to backend?**
- Wait a few seconds for services to fully start
- Check backend health: `curl http://localhost:8080/health`

