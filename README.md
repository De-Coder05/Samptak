# Railway Track Crack Detection System

Our railway track defect detection system is designed to enhance track inspection efficiency by utilizing a camera-based approach mounted on moving trains, particularly slower-moving cargo trains. The system employs the ArduCam OV9281 (a global shutter camera with 120 FPS) to capture high-resolution images of railway tracks in real-time. These images are then analyzed to detect visible cracks and structural defects.

## 🏗️ Architecture

- **Frontend**: React.js application with modern UI for image upload and result display
- **Backend**: FastAPI server with TensorFlow/Keras model for crack detection
- **Deployment**: Docker Compose for containerized deployment

## 📋 Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher, or docker-compose v1.29+)
- At least 4GB of available RAM
- Model file: `model.keras` (optional - system will use a dummy model if not found)

## 🚀 Quick Start

### Option 1: Using Deployment Script (Recommended)

```bash
# Make scripts executable (if not already)
chmod +x deploy.sh stop.sh restart.sh

# Deploy the entire stack
./deploy.sh
```

### Option 2: Using Docker Compose Directly

```bash
# Build and start all services
docker-compose up -d

# Or if using Docker Compose v2
docker compose up -d
```

## 📍 Accessing the Application

Once deployed, access the application at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health
- **API Documentation**: http://localhost:8080/docs (Swagger UI)

## 🛠️ Development

### Running Frontend Locally (Development Mode)

```bash
cd Frontend
npm install
npm start
```

The frontend will run on http://localhost:3000 (or next available port).

### Running Backend Locally (Development Mode)

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

The backend will run on http://localhost:8080.

## 📦 Project Structure

```
Samptak/
├── Frontend/              # React frontend application
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Styling
│   │   └── index.js      # Entry point
│   ├── public/
│   ├── Dockerfile        # Frontend Docker configuration
│   └── nginx.conf        # Nginx configuration
├── app.py                # FastAPI backend server
├── requirements.txt      # Python dependencies
├── Dockerfile           # Backend Docker configuration
├── docker-compose.yml   # Docker Compose configuration
├── deploy.sh            # Deployment script
├── stop.sh              # Stop script
└── restart.sh           # Restart script
```

## 🔧 Configuration

### Environment Variables

#### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8080)

#### Backend
- `PYTHONUNBUFFERED`: Set to 1 for real-time logging

### Model File

Place your trained model file (`model.keras`) in the root directory. If the model file is not found, the system will use a dummy model for testing purposes.

## 📡 API Endpoints

### GET `/`
Returns API status message.

### GET `/health`
Returns health check status and model loading status.

### POST `/upload/`
Upload an image for crack detection.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
```json
{
  "message": "Crack Detected" | "No Crack Found",
  "confidence": 85.5,
  "raw_prediction": 0.855
}
```

## 🐳 Docker Commands

### Build Images
```bash
docker-compose build
```

### Start Services
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild and Restart
```bash
docker-compose up -d --build
```

## 🧪 Testing

### Test Backend Health
```bash
curl http://localhost:8080/health
```

### Test Image Upload
```bash
curl -X POST "http://localhost:8080/upload/" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/your/image.jpg"
```

## 🐛 Troubleshooting

### Port Already in Use
If ports 3000 or 8080 are already in use, modify `docker-compose.yml` to use different ports:
```yaml
ports:
  - "3001:80"  # Frontend
  - "8081:8080"  # Backend
```

### Model Not Loading
- Ensure `model.keras` is in the root directory
- Check backend logs: `docker-compose logs backend`
- The system will work with a dummy model if the file is missing

### Frontend Can't Connect to Backend
- Ensure both services are running: `docker-compose ps`
- Check CORS settings in `app.py`
- Verify `REACT_APP_API_URL` environment variable

### Build Failures
- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache`

## 📝 Notes

- The backend uses TensorFlow/Keras for model inference
- Images are resized to 300x300 pixels before processing
- The system supports common image formats (JPEG, PNG, etc.)
- CORS is configured to allow all origins (change in production)

## 🔒 Production Considerations

Before deploying to production:

1. **Security**:
   - Restrict CORS origins in `app.py`
   - Use environment variables for sensitive configuration
   - Enable HTTPS

2. **Performance**:
   - Use a production-ready WSGI server (e.g., Gunicorn with Uvicorn workers)
   - Configure Nginx for better static file serving
   - Implement caching strategies

3. **Monitoring**:
   - Set up logging and monitoring
   - Configure health checks
   - Implement error tracking

## 📄 License

[Add your license information here]

## 👥 Contributors

[Add contributor information here]
