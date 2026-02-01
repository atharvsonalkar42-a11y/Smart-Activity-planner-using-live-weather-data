# Smart Activity Planner

A modern web application that provides real-time weather-based activity recommendations using live weather data analysis.

## Features

- **Real-time Weather Data**: Fetches live weather information using OpenWeatherMap API
- **Smart Activity Recommendations**: AI-powered suggestions based on weather conditions
- **Beautiful UI**: Modern, aesthetic interface with animated weather symbols
- **Interactive Visualizations**: Pie charts for activity analysis and trend graphs
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Python 3.x**
- **Flask** - Web framework
- **Requests** - HTTP client for API calls

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with animations and gradients
- **JavaScript** - Interactivity and API communication
- **Chart.js** - Data visualization

### External APIs
- **OpenWeatherMap API** - Real-time weather data

## Project Structure

```
smart-activity-planner/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Styles and animations
│   ├── js/
│   │   └── script.js     # Frontend JavaScript
│   └── images/           # Static images
└── README.md            # This file
```

## How It Works

### System Workflow

1. **User Input**: User enters a city name
2. **API Request**: Frontend sends request to Flask backend
3. **Weather Data**: Backend fetches live weather data from OpenWeatherMap
4. **Analysis**: Weather conditions are analyzed and categorized
5. **Recommendations**: Activity suggestions are generated based on weather
6. **Visualization**: Data is displayed with charts and animations

### Weather Logic

- **Sunny** ☀️ → Outdoor activities (hiking, cycling, beach sports)
- **Rainy** 🌧️ → Indoor activities (museums, movies, cooking)
- **Cold** ❄️ → Warm indoor plans (swimming, yoga, cafes)
- **Cloudy** ☁️ → Light outdoor activities (jogging, photography, gardening)

### Data Points Displayed

- **Temperature** (°C)
- **Humidity** (%)
- **Wind Speed** (km/h)
- **Air Quality** (Good/Normal/Bad)

## Features in Detail

### User Interface

- **Input Page**: Clean, modern interface for city selection
- **Results Page**: Comprehensive weather dashboard with:
  - Main activity recommendation with animated character
  - Weather detail cards with icons
  - Activity analysis pie chart (Outdoor vs Indoor)
  - Weather trends line chart
  - Additional activity recommendations

### Visual Design

- **Modern Gradients**: Beautiful color schemes throughout
- **Animated Elements**: Floating sun, bouncing characters, smooth transitions
- **Weather Icons**: Dynamic icons that change based on conditions
- **Responsive Layout**: Adapts to different screen sizes
- **Glass Morphism**: Modern UI with backdrop filters

### Data Visualization

- **3D Pie Chart**: Shows outdoor vs indoor activity distribution
- **Line Charts**: Display weather trends throughout the day
- **Interactive Elements**: Hover effects and smooth animations

## API Integration

The application integrates with OpenWeatherMap API to fetch:

- Current temperature
- Humidity levels
- Wind speed
- Weather conditions
- Weather descriptions

## Activity Recommendations

The system provides 4 recommendations per weather condition:

### Sunny Weather
- Go Hiking
- Beach Volleyball
- Picnic in the Park
- Cycling

### Rainy Weather
- Visit Museum
- Indoor Rock Climbing
- Movie Marathon
- Cooking Workshop

### Cold Weather
- Indoor Swimming
- Hot Yoga
- Coffee Shop Tour
- Board Games Cafe

### Cloudy Weather
- Light Jogging
- Photography Walk
- Gardening
- Window Shopping

## Customization

### Adding New Activities

To add new activities, modify the `recommend_activities()` function in `app.py`:

```python
def recommend_activities(weather_condition):
    recommendations = {
        "sunny": [
            {"name": "New Activity", "description": "Description", "type": "outdoor"},
            # Add more activities...
        ],
        # Add other weather conditions...
    }
```

### Styling Changes

Modify `static/css/style.css` to customize:
- Colors and gradients
- Animations
- Layout
- Typography

## Troubleshooting

