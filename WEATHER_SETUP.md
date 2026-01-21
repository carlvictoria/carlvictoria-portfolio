# Weather Modal Setup Instructions

## OpenWeather API Key Setup

To enable the Weather Modal functionality, you need to get a free API key from OpenWeather:

### Steps:

1. **Visit OpenWeather API**
   - Go to: https://openweathermap.org/api
   - Click "Subscribe" under the "Current Weather Data" plan (it's free)

2. **Create Account**
   - Sign up for a free account
   - Verify your email address

3. **Get API Key**
   - Go to: https://home.openweathermap.org/api_keys
   - Copy your API key

4. **Add to Environment Variables**
   - Open `.env.local` file in the root directory
   - Replace `your_api_key_here` with your actual API key:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

5. **Restart Development Server**
   - Stop the dev server (Ctrl+C)
   - Run `npm run dev` again

## Features

The Weather Modal includes:

- **Interactive Map**: Powered by Leaflet and OpenStreetMap
- **Weather Layers**: Toggle between Clouds, Precipitation, and Temperature overlays
- **Location Search**: Search and jump to any location worldwide
- **Real-time Data**: Current weather conditions, wind speed, humidity, etc.
- **Responsive Design**: Works on different screen sizes
- **Dark/Light Theme**: Matches your portfolio theme

## Usage

1. Click on the "Weather App" option in the main CMD interface
2. Search for any location (city, country, etc.)
3. View the interactive map with weather overlays
4. Switch between different weather layers
5. Explore weather data for different locations

## API Limits

The free OpenWeather plan includes:
- 60 calls/minute
- 1,000 calls/day
- Current weather data
- Weather maps and layers

This is sufficient for portfolio demonstration and testing.