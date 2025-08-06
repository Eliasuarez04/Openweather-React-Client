import { useState } from 'react'

const App = () => {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  const fetchByCity = async () => {
    if (city.trim() === '') return
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
      )
      if (!res.ok) throw new Error('Ciudad no encontrada')
      const data = await res.json()
      setWeather(data)
      setError('')
    } catch (err) {
      setWeather(null)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchByLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no disponible')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=es`
          )
          if (!res.ok) throw new Error('No se pudo obtener el clima')
          const data = await res.json()
          setWeather(data)
          setError('')
        } catch (err) {
          setWeather(null)
          setError(err.message)
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('No se pudo acceder a tu ubicación')
        setLoading(false)
      }
    )
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchByCity()
  }

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Clima en Tiempo Real</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Escribe una ciudad..."
            className="w-full border px-4 py-2 rounded"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={fetchByCity}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Buscar
          </button>
        </div>

        <button
          onClick={fetchByLocation}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition mb-4"
        >
          Usar mi ubicación 📍
        </button>

        {loading && <p className="text-center text-gray-500">Cargando clima...</p>}

        {error && <p className="text-red-500 text-center">{error}</p>}

        {weather && (
          <div className="text-center mt-4">
            <h2 className="text-2xl font-semibold">{weather.name}, {weather.sys.country}</h2>
            <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
            <p className="capitalize text-gray-600">{weather.weather[0].description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Humedad: {weather.main.humidity}% | Viento: {weather.wind.speed} m/s
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
