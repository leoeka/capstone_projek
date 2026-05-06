import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { AuthContext } from './AuthContext'

const API = 'http://localhost:5000/api/auth'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [cvResult, setCvResult] = useState(null)

    const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }, [])

  useEffect(() => {
    if (!token) {
      return
    }

    axios.get(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {
      logout()
    })
  }, [token, logout])

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
      setToken(token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login gagal' }
    }
  }

  const updateUser = async (formData) => {
    try {

      const res = await axios.put(`${API}/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const updated = res.data.user
      setUser(updated)
      localStorage.setItem('user', JSON.stringify(updated))
      return { success: true }
    } catch (error) {
      console.error(error);
      return { success: false, message: error.response?.data?.message || 'Gagal update profil' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, updateUser, cvResult, setCvResult }}>
      {children}
    </AuthContext.Provider>
  )
}
