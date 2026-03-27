import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from joblib import dump

# Generate synthetic weather training data
np.random.seed(42)
n_samples = 500

# Features
temperature = np.random.uniform(10, 35, n_samples)
humidity = np.random.uniform(30, 95, n_samples)
wind_speed = np.random.uniform(0, 40, n_samples)
pressure = np.random.uniform(990, 1030, n_samples)

X = np.column_stack([temperature, humidity, wind_speed, pressure])

# Target: rain_probability and predicted_temp
rain_prob = 0.3 + 0.002 * (100 - humidity) + 0.001 * wind_speed - 0.0003 * (1013 - pressure) + np.random.normal(0, 0.1, n_samples)
rain_prob = np.clip(rain_prob, 0, 1)

pred_temp = temperature + 0.01 * (humidity - 60) - 0.05 * wind_speed + 0.0005 * (1013 - pressure) + np.random.normal(0, 1, n_samples)

y = np.column_stack([rain_prob, pred_temp])

# Train multi-output random forest model
model = MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1))
model.fit(X, y)

# Save model
dump(model, "weather_model.joblib")
print("Model trained and saved to weather_model.joblib")
print(f"Training complete. Model R² score: {model.score(X, y):.4f}")
