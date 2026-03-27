# Intelligent Weather API

A sample fullstack project for predicting weather conditions and historic trends using a simple ML model and a JavaScript frontend.

## Structure

- `backend/` - FastAPI service, model training script, Dockerfile.
- `frontend/` - Static HTML/CSS/JS UI.
- `k8s/` - Kubernetes deployment and service manifests.

## Run locally

```powershell
cd backend
python -m pip install -r requirements.txt
python train_model.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Then open `frontend/index.html` (or serve via `python -m http.server 8080`).

## Endpoints

- `GET /health` - status
- `POST /predict` - expects JSON payload with `temperature`, `humidity`, `wind_speed`, `pressure`.
  - returns `rain_probability` and `predicted_temp`.

## Docker

```bash
docker build -t intelligent-weather-api:latest backend
docker run -p 8000:8000 intelligent-weather-api:latest
```

## Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```
