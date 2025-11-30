import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Registro(){
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated])
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!email || !password) return setError('Email y contraseña son requeridos')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')
    if (password !== confirm) return setError('Las contraseñas no coinciden')

    setLoading(true)
    const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') || window.location.origin
    const url = `${API_BASE}/api/registro`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      })

      let data = null
      try {
        data = await res.json()
      } catch (e) {
        // response not JSON
        data = { raw: await res.text().catch(() => null) }
      }

      if (!res.ok) {
        const serverMsg = data?.error || data?.raw || `${res.status} ${res.statusText}`
        console.error('Registro falló:', res.status, res.statusText, data)
        setError(serverMsg || 'Error al registrar')
        setLoading(false)
        return
      }

      setSuccess('Registro exitoso. Redirigiendo al login...')
      setTimeout(()=> navigate('/login'), 1200)
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
        <h2>Crear Cuenta</h2>
        <p className="form-subtitle">Únete a nuestra comunidad</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <label>
          Nombre
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Tu nombre completo"
          />
        </label>

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
            placeholder="Mínimo 6 caracteres"
          />
        </label>

        <label>
          Confirmar Contraseña
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="Repite la contraseña"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <div className="auth-alternate">
        <span>¿Ya tienes una cuenta? </span>
        <button type="button" className="link-button" onClick={() => navigate('/login')}>
          Inicia sesión
        </button>
      </div>
    </div>
  )
}
