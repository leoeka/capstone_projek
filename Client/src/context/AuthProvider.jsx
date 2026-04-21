import { useState, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from './AuthContext'

const API = 'http://localhost:5000/api/auth'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }

    axios.get(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }). catch (() => {
      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    })
  }, [])

  const register = async (data) => {
    try {
      const res = await axios.post(`${API}/register`, data)
      return { success: true, message: res.data.message }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registrasi gagal' }
    }
  }

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API}/login`, { email, password })
      const { user, token } = res.data
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login gagal' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const updateUser = (data) => {
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
