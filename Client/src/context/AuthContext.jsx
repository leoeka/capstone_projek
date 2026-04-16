import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const register = (data) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const exists = users.find(u => u.email === data.email)
    if (exists) return { success: false, message: 'Email sudah terdaftar' }
    users.push(data)
    localStorage.setItem('users', JSON.stringify(users))
    return { success: true }
  }

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, message: 'Email atau password salah' }
    setUser(found)
    localStorage.setItem('user', JSON.stringify(found))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateUser = (data) => {
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const idx = users.findIndex(u => u.email === updated.email)
    if (idx !== -1) {
      users[idx] = updated
      localStorage.setItem('users', JSON.stringify(users))
    }
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
