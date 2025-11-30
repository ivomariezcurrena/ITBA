import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) return setError('Email y contraseña son requeridos')
    setLoading(true)
    // Normalizar base URL y fallback a origen actual si no está definido
    const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') || window.location.origin
    const url = `${API_BASE}/api/login`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      let data = null
      try {
        data = await res.json()
      } catch (e) {
        data = { raw: await res.text().catch(() => null) }
      }

      if (!res.ok) {
        const serverMsg = data?.error || data?.raw || `${res.status} ${res.statusText}`
        console.error('Login falló:', res.status, res.statusText, data)
        setError(serverMsg || 'Error al autenticar')
        setLoading(false)
        return
      }

      // data: { token, user }
      login({ token: data.token, user: data.user })
      navigate('/')
    } catch (err) {
      console.error('Error de red al llamar a', url, err)
      setError(err.message || 'Error de red')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <p className="form-subtitle">Bienvenido de nuevo</p>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Correo Electrónico
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tumail@ejemplo.com"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="auth-alternate">
        <span>¿No tienes una cuenta? </span>
        <button type="button" className="link-button" onClick={() => navigate('/registro')}>
          Regístrate
        </button>
      </div>
    </div>
  )
}
