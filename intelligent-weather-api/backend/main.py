from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from joblib import load
import os

app = FastAPI(title="Intelligent Weather API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WeatherInput(BaseModel):
    temperature: float = Field(..., description="Current temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity percentage")
    wind_speed: float = Field(..., ge=0, description="Wind speed in km/h")
    pressure: float = Field(..., description="Atmospheric pressure in hPa")

class PredictionResponse(BaseModel):
    rain_probability: float
    predicted_temp: float

# Load trained model
model_path = "weather_model.joblib"
model = None

if os.path.exists(model_path):
    try:
        model = load(model_path)
    except Exception as e:
        print(f"Error loading model: {e}")

@app.get("/")
def root():
    return {"message": "Intelligent Weather API", "status": "ok"}

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "version": "1.0.0"
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(data: WeatherInput):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded. Run train_model.py first."
        )

    input_vector = [[
        data.temperature,
        data.humidity,
        data.wind_speed,
        data.pressure,
    ]]

    predictions = model.predict(input_vector)[0]

    rain_prob = float(predictions[0])
    final_temp = float(predictions[1])

    return {
        "rain_probability": round(max(0.0, min(1.0, rain_prob)), 4),
        "predicted_temp": round(final_temp, 2),
    }
