from flask import Flask, render_template, request, jsonify
import requests
import json
from datetime import datetime

app = Flask(__name__)

# OpenWeatherMap API configuration
API_KEY = "be6a8d9761cb97ec130f8bfa22d92561"  # Replace with your actual API key
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast"

def get_weather_data(city):
    """Fetch weather data from OpenWeatherMap API"""
    try:
        params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'  # Get temperature in Celsius
        }
        response = requests.get(BASE_URL, params=params)
        
        print(f"Weather API request for '{city}': Status {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Weather data received for '{city}'")
            return data
        else:
            print(f"Weather API error for '{city}': {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Error fetching weather data for '{city}': {e}")
        return None

def get_forecast_data(city):
    """Fetch 5-day weather forecast data from OpenWeatherMap API"""
    try:
        params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'  # Get temperature in Celsius
        }
        response = requests.get(FORECAST_URL, params=params)
        
        print(f"Forecast API request for '{city}': Status {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Forecast data received for '{city}'")
            return data
        else:
            print(f"Forecast API error for '{city}': {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Error fetching forecast data for '{city}': {e}")
        return None

def process_forecast_data(forecast_data):
    """Process forecast data to get next 2 days weather summary"""
    if not forecast_data:
        return []
    
    # Get current date
    current_date = datetime.now().date()
    
    # Process forecast data for next 2 days
    daily_forecasts = {}
    
    for item in forecast_data['list']:
        forecast_date = datetime.fromtimestamp(item['dt']).date()
        
        # Only consider next 2 days (not today)
        days_ahead = (forecast_date - current_date).days
        if 1 <= days_ahead <= 2:
            if forecast_date not in daily_forecasts:
                daily_forecasts[forecast_date] = {
                    'temps': [],
                    'humidity': [],
                    'wind_speed': [],
                    'weather_conditions': [],
                    'descriptions': []
                }
            
            daily_forecasts[forecast_date]['temps'].append(item['main']['temp'])
            daily_forecasts[forecast_date]['humidity'].append(item['main']['humidity'])
            daily_forecasts[forecast_date]['wind_speed'].append(item['wind']['speed'])
            daily_forecasts[forecast_date]['weather_conditions'].append(item['weather'][0]['main'].lower())
            daily_forecasts[forecast_date]['descriptions'].append(item['weather'][0]['description'])
    
    # Calculate daily averages and dominant conditions
    processed_forecasts = []
    for date, data in sorted(daily_forecasts.items()):
        avg_temp = sum(data['temps']) / len(data['temps'])
        avg_humidity = sum(data['humidity']) / len(data['humidity'])
        avg_wind_speed = sum(data['wind_speed']) / len(data['wind_speed'])
        
        # Find most common weather condition
        from collections import Counter
        dominant_condition = Counter(data['weather_conditions']).most_common(1)[0][0]
        
        # Get most common description
        dominant_description = Counter(data['descriptions']).most_common(1)[0][0]
        
        # Analyze weather condition
        weather_condition = analyze_forecast_condition(dominant_condition, avg_temp, avg_humidity)
        
        # Get air quality
        air_quality = get_air_quality(avg_temp, avg_humidity, avg_wind_speed)
        
        # Get recommendations
        recommendations = recommend_activities(weather_condition)
        
        # Calculate activity distribution
        activity_distribution = calculate_activity_distribution(weather_condition)
        
        processed_forecasts.append({
            'date': date.strftime('%Y-%m-%d'),
            'day_name': date.strftime('%A'),
            'temperature': round(avg_temp, 1),
            'humidity': round(avg_humidity),
            'wind_speed': round(avg_wind_speed * 3.6, 1),  # Convert m/s to km/h
            'air_quality': air_quality,
            'weather_description': dominant_description,
            'weather_condition': weather_condition,
            'recommendations': recommendations,
            'activity_distribution': activity_distribution
        })
    
    return processed_forecasts

def analyze_forecast_condition(weather_main, temp, humidity):
    """Analyze forecast weather condition"""
    if weather_main == 'rain' or weather_main == 'drizzle':
        return "rainy"
    elif weather_main == 'clear':
        return "sunny"
    elif weather_main == 'clouds':
        return "cloudy"
    elif weather_main == 'snow':
        return "cold"
    elif temp < 10:
        return "cold"
    elif temp > 25 and humidity < 60:
        return "sunny"
    else:
        return "cloudy"

def analyze_weather_condition(weather_data):
    """Analyze weather condition and determine category"""
    if not weather_data:
        return "unknown"
    
    main_weather = weather_data['weather'][0]['main'].lower()
    temp = weather_data['main']['temp']
    humidity = weather_data['main']['humidity']
    wind_speed = weather_data['wind']['speed']
    
    # Determine weather condition based on multiple factors
    if main_weather == 'rain' or main_weather == 'drizzle':
        return "rainy"
    elif main_weather == 'clear':
        return "sunny"
    elif main_weather == 'clouds':
        return "cloudy"
    elif main_weather == 'snow':
        return "cold"
    elif temp < 10:
        return "cold"
    elif temp > 25 and humidity < 60:
        return "sunny"
    else:
        return "cloudy"

def get_air_quality(temp, humidity, wind_speed):
    """Determine air quality based on weather parameters"""
    if humidity > 80 or temp > 35:
        return "bad"
    elif humidity > 60 or temp > 30:
        return "normal"
    else:
        return "good"

def recommend_activities(weather_condition):
    """Recommend activities based on weather condition"""
    recommendations = {
        "sunny": [
            {"name": "Go Hiking!!", "description": "Ideal weather for hiking!", "type": "outdoor"},
            {"name": "Beach Volleyball", "description": "Perfect for outdoor sports", "type": "outdoor"},
            {"name": "Picnic in the Park", "description": "Great weather for outdoor dining", "type": "outdoor"},
            {"name": "Cycling", "description": "Excellent conditions for biking", "type": "outdoor"}
        ],
        "rainy": [
            {"name": "Visit Museum", "description": "Perfect indoor cultural activity", "type": "indoor"},
            {"name": "Indoor Rock Climbing", "description": "Stay active while staying dry", "type": "indoor"},
            {"name": "Movie Marathon", "description": "Cozy indoor entertainment", "type": "indoor"},
            {"name": "Cooking Workshop", "description": "Learn new culinary skills", "type": "indoor"}
        ],
        "cold": [
            {"name": "Indoor Swimming", "description": "Warm indoor pool activity", "type": "indoor"},
            {"name": "Hot Yoga", "description": "Stay warm and flexible", "type": "indoor"},
            {"name": "Coffee Shop Tour", "description": "Warm indoor exploration", "type": "indoor"},
            {"name": "Board Games Cafe", "description": "Cozy indoor gaming", "type": "indoor"}
        ],
        "cloudy": [
            {"name": "Light Jogging", "description": "Good conditions for light exercise", "type": "outdoor"},
            {"name": "Photography Walk", "description": "Great lighting for photos", "type": "outdoor"},
            {"name": "Gardening", "description": "Perfect weather for outdoor work", "type": "outdoor"},
            {"name": "Window Shopping", "description": "Comfortable weather for walking", "type": "outdoor"}
        ]
    }
    
    return recommendations.get(weather_condition, [
        {"name": "Mixed Activities", "description": "Weather is variable", "type": "mixed"}
    ])

def calculate_activity_distribution(weather_condition):
    """Calculate outdoor vs indoor activity distribution"""
    distributions = {
        "sunny": {"outdoor": 75, "indoor": 25},
        "rainy": {"outdoor": 15, "indoor": 85},
        "cold": {"outdoor": 20, "indoor": 80},
        "cloudy": {"outdoor": 55, "indoor": 45}
    }
    
    return distributions.get(weather_condition, {"outdoor": 50, "indoor": 50})

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/get_weather', methods=['POST'])
def get_weather():
    """Handle weather request from frontend"""
    try:
        data = request.get_json()
        city = data.get('city', '').strip()
        
        if not city:
            return jsonify({'error': 'Please enter a city name'}), 400
        
        # Fetch weather data
        weather_data = get_weather_data(city)
        
        if not weather_data:
            return jsonify({'error': 'City not found or API error'}), 404
        
        # Fetch forecast data for next 2 days
        forecast_data = get_forecast_data(city)
        forecast_processed = process_forecast_data(forecast_data) if forecast_data else []
        
        # Extract relevant information
        temp = weather_data['main']['temp']
        humidity = weather_data['main']['humidity']
        wind_speed = weather_data['wind']['speed']
        weather_description = weather_data['weather'][0]['description']
        weather_condition = analyze_weather_condition(weather_data)
        air_quality = get_air_quality(temp, humidity, wind_speed)
        
        # Get recommendations
        recommendations = recommend_activities(weather_condition)
        activity_distribution = calculate_activity_distribution(weather_condition)
        
        # Prepare response data
        response_data = {
            'city': city,
            'temperature': round(temp, 1),
            'humidity': humidity,
            'wind_speed': round(wind_speed * 3.6, 1),  # Convert m/s to km/h
            'air_quality': air_quality,
            'weather_description': weather_description,
            'weather_condition': weather_condition,
            'recommendations': recommendations,
            'activity_distribution': activity_distribution,
            'forecast': forecast_processed,  # Add forecast data for next 2 days
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error in get_weather: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
