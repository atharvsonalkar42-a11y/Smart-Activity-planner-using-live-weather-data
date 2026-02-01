// Global variables
let activityPieChart = null;
let weatherTrendChart = null;
let currentWeatherData = null;

// Weather icons mapping
const weatherIcons = {
    sunny: '☀️',
    rainy: '🌧️',
    cloudy: '☁️',
    cold: '❄️',
    default: '🌤️'
};

// Activity icons mapping
const activityIcons = {
    'Go Hiking!!': '🚶‍♂️',
    'Beach Volleyball': '🏐',
    'Picnic in the Park': '🧺',
    'Cycling': '🚴‍♂️',
    'Visit Museum': '🏛️',
    'Indoor Rock Climbing': '🧗‍♀️',
    'Movie Marathon': '🎬',
    'Cooking Workshop': '👨‍🍳',
    'Indoor Swimming': '🏊‍♂️',
    'Hot Yoga': '🧘‍♀️',
    'Coffee Shop Tour': '☕',
    'Board Games Cafe': '🎲',
    'Light Jogging': '🏃‍♂️',
    'Photography Walk': '📷',
    'Gardening': '🌱',
    'Window Shopping': '🛍️',
    'default': '🎯'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for input fields
    document.getElementById('cityInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeatherData();
        }
    });
    
    document.getElementById('locationInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeatherData();
        }
    });
});

// Show loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.remove('active');
    }, 500);
}

// Show input page
function showInputPage() {
    document.getElementById('inputPage').classList.add('active');
    document.getElementById('resultsPage').classList.remove('active');
    // Clear input field when going back
    document.getElementById('cityInput').value = '';
}

// Show results page
function showResultsPage() {
    document.getElementById('inputPage').classList.remove('active');
    document.getElementById('resultsPage').classList.add('active');
}

// Get weather data from backend
async function getWeatherData() {
    const cityInput = document.getElementById('cityInput');
    const locationInput = document.getElementById('locationInput');
    const city = cityInput.value.trim() || locationInput.value.trim();
    
    if (!city) {
        showNotification('Please enter a city name', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/get_weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: city })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentWeatherData = data;
            updateUI(data);
            showResultsPage();
        } else {
            showNotification(data.error || 'Failed to fetch weather data', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Update UI with weather data
function updateUI(data) {
    // Update location input
    document.getElementById('locationInput').value = data.city;
    
    // Update time and date
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    // Update time and date for all cards
    document.getElementById('currentTime').textContent = timeString;
    document.getElementById('currentDate').textContent = dateString;
    document.getElementById('currentTime2').textContent = timeString;
    document.getElementById('currentDate2').textContent = dateString;
    document.getElementById('currentTime3').textContent = timeString;
    document.getElementById('currentDate3').textContent = dateString;
    document.getElementById('currentTime4').textContent = timeString;
    document.getElementById('currentDate4').textContent = dateString;
    
    // Update weather details
    document.getElementById('temperature').textContent = `${data.temperature}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind_speed} km/h`;
    document.getElementById('airQuality').textContent = data.air_quality;
    
    // Apply weather-specific classes to cards
    const tempCard = document.getElementById('tempCard');
    const humidityCard = document.getElementById('humidityCard');
    const windCard = document.getElementById('windCard');
    const airCard = document.getElementById('airCard');
    
    // Remove existing weather classes
    [tempCard, humidityCard, windCard, airCard].forEach(card => {
        card.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'cold');
    });
    
    // Add weather class based on condition
    const weatherClass = data.weather_condition;
    [tempCard, humidityCard, windCard, airCard].forEach(card => {
        card.classList.add(weatherClass);
    });
    
    // Update main activity recommendation
    const mainRecommendation = data.recommendations[0];
    document.getElementById('mainActivity').textContent = mainRecommendation.name;
    document.getElementById('activityDescription').textContent = mainRecommendation.description;
    
    // Update activity icon
    const activityIcon = activityIcons[mainRecommendation.name] || activityIcons.default;
    document.getElementById('activityIcon').textContent = activityIcon;
    
    // Update weather icon in header
    const weatherIcon = weatherIcons[data.weather_condition] || weatherIcons.default;
    document.querySelector('.main-header .sun-icon').textContent = weatherIcon;
    
    // Update recommendations grid
    updateRecommendations(data.recommendations);
    
    // Update forecast section
    updateForecast(data.forecast);
    
    // Update charts
    updateActivityPieChart(data.activity_distribution);
    updateWeatherTrendChart(data);
    
    // Add animations
    addAnimations();
}

// Update forecast section
function updateForecast(forecastData) {
    const grid = document.getElementById('forecastGrid');
    grid.innerHTML = '';
    
    if (!forecastData || forecastData.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1;">No forecast data available</p>';
        return;
    }
    
    forecastData.forEach((day, index) => {
        const card = document.createElement('div');
        card.className = 'forecast-card fade-in';
        card.style.animationDelay = `${index * 0.2}s`;
        
        const mainRecommendation = day.recommendations[0];
        const weatherIcon = weatherIcons[day.weather_condition] || weatherIcons.default;
        const activityIcon = activityIcons[mainRecommendation.name] || activityIcons.default;
        
        card.innerHTML = `
            <div class="forecast-header">
                <div class="forecast-day">${day.day_name}</div>
                <div class="forecast-date">${day.date}</div>
            </div>
            
            <div class="forecast-weather">
                <div class="forecast-weather-icon">${weatherIcon}</div>
                <div class="forecast-weather-desc">${day.weather_description}</div>
            </div>
            
            <div class="forecast-details">
                <div class="forecast-detail">
                    <span class="forecast-detail-icon">🌡️</span>
                    <span class="forecast-detail-value">${day.temperature}°C</span>
                </div>
                <div class="forecast-detail">
                    <span class="forecast-detail-icon">💧</span>
                    <span class="forecast-detail-value">${day.humidity}%</span>
                </div>
                <div class="forecast-detail">
                    <span class="forecast-detail-icon">💨</span>
                    <span class="forecast-detail-value">${day.wind_speed} km/h</span>
                </div>
                <div class="forecast-detail">
                    <span class="forecast-detail-icon">😊</span>
                    <span class="forecast-detail-value">${day.air_quality}</span>
                </div>
            </div>
            
            <div class="forecast-activity">
                <h4>
                    <span>${activityIcon}</span>
                    ${mainRecommendation.name}
                </h4>
                <p>${mainRecommendation.description}</p>
                <span class="forecast-activity-type ${mainRecommendation.type}">${mainRecommendation.type.toUpperCase()}</span>
            </div>
            
            <div class="forecast-distribution">
                <div class="forecast-dist-item outdoor">
                    <span class="forecast-dist-value">${day.activity_distribution.outdoor}%</span>
                    <span class="forecast-dist-label">OUTDOOR</span>
                </div>
                <div class="forecast-dist-item indoor">
                    <span class="forecast-dist-value">${day.activity_distribution.indoor}%</span>
                    <span class="forecast-dist-label">INDOOR</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Update recommendations grid
function updateRecommendations(recommendations) {
    const grid = document.getElementById('recommendationsGrid');
    grid.innerHTML = '';
    
    recommendations.slice(1).forEach((rec, index) => {
        const card = document.createElement('div');
        card.className = 'recommendation-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const icon = activityIcons[rec.name] || activityIcons.default;
        const typeClass = rec.type === 'outdoor' ? 'outdoor' : 'indoor';
        
        card.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 15px;">${icon}</div>
            <h4>${rec.name}</h4>
            <p>${rec.description}</p>
            <span class="activity-type ${typeClass}">${rec.type.toUpperCase()}</span>
        `;
        
        grid.appendChild(card);
    });
}

// Update activity pie chart
function updateActivityPieChart(distribution) {
    const ctx = document.getElementById('activityPieChart').getContext('2d');
    
    if (activityPieChart) {
        activityPieChart.destroy();
    }
    
    activityPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Outdoor', 'Indoor'],
            datasets: [{
                data: [distribution.outdoor, distribution.indoor],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(33, 150, 243, 0.8)'
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(33, 150, 243, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14,
                            family: 'Poppins'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

// Update weather trend chart
function updateWeatherTrendChart(data) {
    const ctx = document.getElementById('weatherTrendChart').getContext('2d');
    
    if (weatherTrendChart) {
        weatherTrendChart.destroy();
    }
    
    // Generate sample trend data (in real app, this would come from historical data)
    const hours = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
    const temperatures = generateTrendData(data.temperature, 6);
    const humidity = generateTrendData(data.humidity, 6);
    
    weatherTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Humidity (%)',
                data: humidity,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14,
                            family: 'Poppins'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Generate trend data based on current value
function generateTrendData(currentValue, points) {
    const data = [];
    const variation = currentValue * 0.2; // 20% variation
    
    for (let i = 0; i < points; i++) {
        const randomVariation = (Math.random() - 0.5) * variation;
        data.push(Math.round(currentValue + randomVariation));
    }
    
    return data;
}

// Add animations to elements
function addAnimations() {
    // Animate weather cards
    const cards = document.querySelectorAll('.weather-card');
    cards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Animate best activity section
    const bestActivity = document.querySelector('.best-activity');
    bestActivity.classList.add('slide-in');
    
    // Animate analysis cards
    const analysisCards = document.querySelectorAll('.analysis-card');
    analysisCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// Show notification (instead of alert)
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    // Set background color based on type
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)';
    } else if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
