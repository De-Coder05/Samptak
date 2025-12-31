# Use an official Python image as a base
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first (for better caching)
COPY requirements.txt ./

# Install Python dependencies with increased timeout
RUN pip install --no-cache-dir --default-timeout=300 -r requirements.txt || \
    pip install --no-cache-dir --default-timeout=300 -r requirements.txt

# Copy the rest of the app
COPY . .

# Ignore virtual environment and cache files
RUN rm -rf venv __pycache__ .pytest_cache || true

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["python", "app.py"]
