import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useAuthStore } from '../../stores/authStore'
import { api } from '../../lib/api'
import { FaEye, FaEyeSlash, FaHeart } from 'react-icons/fa'

export function LoginModule() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isRegister) {
      try {
        const response = await api.auth.register({ username, password })
        if (response.token) {
          await login(username, password)
        } else {
          setError(response.error || 'Error al registrar')
        }
      } catch (err) {
        setError('Error al registrar usuario')
      }
    } else {
      const success = await login(username, password)
      if (!success) {
        setError('Credenciales inválidas')
      }
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-6">
      <div className="flex items-center gap-2">
        <FaHeart className="h-8 w-8 text-pink-500 fill-pink-500" />
        <h1 className="text-3xl font-bold text-gray-800">Hechos Con Amor</h1>
      </div>
      <p className="text-gray-500">Bisutería y Accesorios</p>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 mt-4"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Cargando...' : isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              className="w-full" 
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
