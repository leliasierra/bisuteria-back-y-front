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
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const login = useAuthStore((state) => state.login)

  const validateUsername = (value: string) => {
    if (isRegister && value.length > 0 && value.length < 3) {
      return 'El usuario debe tener al menos 3 caracteres'
    }
    return undefined
  }

  const validatePassword = (value: string) => {
    if (isRegister && value.length > 0 && value.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres'
    }
    return undefined
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    if (isRegister) {
      setErrors(prev => ({ ...prev, username: validateUsername(value) }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (isRegister) {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }))
    }
  }

  const validateForm = () => {
    if (!isRegister) return true
    
    const newErrors: { username?: string; password?: string } = {}
    let isValid = true

    if (username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres'
      isValid = false
    }
    if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    if (isRegister) {
      try {
        const response = await api.auth.register({ username, password })
        if (response.token) {
          await login(username, password)
        } else {
          const errorMsg = response.error
          if (Array.isArray(errorMsg)) {
            const passError = errorMsg.find((e: any) => e.path?.includes('password'))
            if (passError) {
              setError(passError.message)
            } else {
              setError('Error al registrar')
            }
          } else {
            setError(errorMsg || 'Error al registrar')
          }
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
                onChange={(e) => handleUsernameChange(e.target.value)}
                onBlur={() => isRegister && setErrors(prev => ({ ...prev, username: validateUsername(username) }))}
                required
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div className="relative">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={() => isRegister && setErrors(prev => ({ ...prev, password: validatePassword(password) }))}
                required
                className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 mt-4"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Cargando...' : isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              className="w-full" 
              onClick={() => { setIsRegister(!isRegister); setErrors({}); setError(''); }}
            >
              {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
