# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Runtime
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies for potential future needs (e.g. cv2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy Backend
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/

# Copy Built Frontend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose Port
EXPOSE 8000

# Run
CMD ["python", "backend/main.py"]
