import React, { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Verifica se há usuário salvo no localStorage ao carregar
    useEffect(() => {
        const savedUser = authService.getUser()
        if (savedUser) {
            setUser(savedUser)
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            setLoading(true)
            setError(null)
            const response = await authService.login(email, password)
            setUser(response.user)
            return response
        } catch (err) {
            setError(err.message || 'Erro ao fazer login')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const register = async (username, email, password, confirmPassword) => {
        try {
            setLoading(true)
            setError(null)
            const response = await authService.register(username, email, password, confirmPassword)
            setUser(response.user)
            return response
        } catch (err) {
            setError(err.message || 'Erro ao registrar')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        authService.logout()
        setUser(null)
        setError(null)
    }

    const isAuthenticated = !!authService.getToken()
    
    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                register,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
