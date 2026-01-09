import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, CloudSnow, Zap } from 'lucide-react';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  visibility: number;
  pressure: number;
}

interface Forecast {
  date: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
}

interface WeatherWidgetProps {
  city: string;
  onClose?: () => void;
}

export function WeatherWidget({ city, onClose }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError('');

      // OpenWeatherMap API (Free tier)
      // Note: In production, use environment variables for API key
      const API_KEY = '8c8a564b2ad5bf0473b07bcbc5bc4c78'; // Demo key - replace with yours
      
      // Current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error('City not found');
      }

      const currentData = await currentResponse.json();
      
      setWeather({
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        wind_speed: Math.round(currentData.wind.speed * 3.6), // m/s to km/h
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        visibility: Math.round(currentData.visibility / 1000), // meters to km
        pressure: currentData.main.pressure
      });

      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&appid=${API_KEY}&units=metric`
      );
      
      const forecastData = await forecastResponse.json();
      
      // Get daily forecast (one per day at 12:00)
      const dailyForecasts: Forecast[] = [];
      const seenDates = new Set();
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toLocaleDateString();
        
        if (!seenDates.has(dateStr) && dailyForecasts.length < 5) {
          seenDates.add(dateStr);
          dailyForecasts.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            temp_max: Math.round(item.main.temp_max),
            temp_min: Math.round(item.main.temp_min),
            description: item.weather[0].description,
            icon: item.weather[0].icon
          });
        }
      });
      
      setForecast(dailyForecasts);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: any = {
      '01d': <Sun className="w-16 h-16 text-yellow-400" />,
      '01n': <Sun className="w-16 h-16 text-gray-400" />,
      '02d': <Cloud className="w-16 h-16 text-gray-300" />,
      '02n': <Cloud className="w-16 h-16 text-gray-500" />,
      '03d': <Cloud className="w-16 h-16 text-gray-400" />,
      '03n': <Cloud className="w-16 h-16 text-gray-600" />,
      '04d': <Cloud className="w-16 h-16 text-gray-500" />,
      '04n': <Cloud className="w-16 h-16 text-gray-700" />,
      '09d': <CloudRain className="w-16 h-16 text-blue-400" />,
      '09n': <CloudRain className="w-16 h-16 text-blue-600" />,
      '10d': <CloudRain className="w-16 h-16 text-blue-500" />,
      '10n': <CloudRain className="w-16 h-16 text-blue-700" />,
      '11d': <Zap className="w-16 h-16 text-yellow-500" />,
      '11n': <Zap className="w-16 h-16 text-yellow-600" />,
      '13d': <CloudSnow className="w-16 h-16 text-blue-200" />,
      '13n': <CloudSnow className="w-16 h-16 text-blue-300" />
    };
    
    return iconMap[iconCode] || <Cloud className="w-16 h-16 text-gray-400" />;
  };

  const getPackingSuggestions = () => {
    if (!weather) return [];
    
    const suggestions = [];
    
    // Temperature-based
    if (weather.temp > 30) {
      suggestions.push('☀️ Sunscreen & sunglasses');
      suggestions.push('👕 Light cotton clothes');
      suggestions.push('💧 Water bottle (stay hydrated!)');
    } else if (weather.temp > 20) {
      suggestions.push('👕 Light jacket for evenings');
      suggestions.push('👟 Comfortable walking shoes');
    } else if (weather.temp > 10) {
      suggestions.push('🧥 Warm jacket');
      suggestions.push('🧣 Scarf or shawl');
    } else {
      suggestions.push('❄️ Heavy winter jacket');
      suggestions.push('🧤 Gloves and warm socks');
      suggestions.push('🎿 Thermal wear');
    }
    
    // Weather condition based
    if (weather.description.includes('rain')) {
      suggestions.push('☔ Umbrella or raincoat');
      suggestions.push('👞 Waterproof shoes');
    }
    
    if (weather.humidity > 70) {
      suggestions.push('👕 Extra clothes (you\'ll sweat!)');
    }
    
    return suggestions;
  };

  const getActivitySuggestions = () => {
    if (!weather) return [];
    
    const activities = [];
    
    if (weather.temp > 25 && !weather.description.includes('rain')) {
      activities.push('🏖️ Perfect for beach activities');
      activities.push('🚶 Great for sightseeing');
    } else if (weather.temp > 15 && weather.temp <= 25) {
      activities.push('🚶 Ideal for walking tours');
      activities.push('📸 Perfect photography weather');
      activities.push('🏞️ Good for outdoor activities');
    } else if (weather.temp <= 15) {
      activities.push('☕ Cozy cafe time');
      activities.push('🏛️ Indoor museum visits');
      activities.push('🛍️ Shopping day!');
    }
    
    if (weather.description.includes('rain')) {
      activities.push('🏛️ Indoor attractions recommended');
      activities.push('☕ Try local cafes & restaurants');
    }
    
    return activities;
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/90 rounded-3xl border border-white/50 shadow-2xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Fetching weather data for {city}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-xl bg-white/90 rounded-3xl border border-white/50 shadow-2xl p-8">
        <div className="text-center">
          <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-red-600 font-bold mb-2">Weather data unavailable</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchWeather}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/90 to-purple-500/90 rounded-3xl border border-white/50 shadow-2xl p-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-1">{city}</h2>
          <p className="text-white/80">Live Weather</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Current Weather */}
      {weather && (
        <div className="bg-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weather.icon)}
              <div>
                <div className="text-6xl font-bold">{weather.temp}°C</div>
                <div className="text-white/80">Feels like {weather.feels_like}°C</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl capitalize">{weather.description}</div>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-sm text-white/70">Humidity</span>
              </div>
              <div className="text-2xl font-bold">{weather.humidity}%</div>
            </div>
            <div className="bg-white/10 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Wind className="w-4 h-4" />
                <span className="text-sm text-white/70">Wind</span>
              </div>
              <div className="text-2xl font-bold">{weather.wind_speed} km/h</div>
            </div>
            <div className="bg-white/10 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm text-white/70">Visibility</span>
              </div>
              <div className="text-2xl font-bold">{weather.visibility} km</div>
            </div>
            <div className="bg-white/10 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4" />
                <span className="text-sm text-white/70">Pressure</span>
              </div>
              <div className="text-2xl font-bold">{weather.pressure} hPa</div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-3">
            {forecast.map((day, idx) => (
              <div key={idx} className="bg-white/10 p-3 rounded-xl text-center">
                <div className="text-sm text-white/70 mb-2">{day.date}</div>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.icon)}
                </div>
                <div className="font-bold">{day.temp_max}°/{day.temp_min}°</div>
                <div className="text-xs text-white/70 capitalize mt-1">{day.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Packing Suggestions */}
      <div className="bg-white/10 rounded-2xl p-6 mb-4">
        <h3 className="text-xl font-bold mb-4">📦 Packing Suggestions</h3>
        <div className="space-y-2">
          {getPackingSuggestions().map((suggestion, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Suggestions */}
      <div className="bg-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">🎯 Activity Suggestions</h3>
        <div className="space-y-2">
          {getActivitySuggestions().map((activity, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>{activity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source */}
      <div className="mt-6 text-center text-xs text-white/60">
        Powered by OpenWeatherMap • Updated in real-time
      </div>
    </div>
  );
}