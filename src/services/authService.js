import api from './api'

export const authService = {

    async register(username, email, password, confirmPassword) {
        try {

            const response = await api.post('/auth/register', {
                username,
                email,
                password,
                confirmPassword
            })

            if (response.data.token) {
                localStorage.setItem('token', response.data.token)
            }

            // Só salva user se existir
            if (response.data.user) {
                localStorage.setItem(
                    'user',
                    JSON.stringify(response.data.username)
                )
            }

            return response.data

        } catch (error) {
            throw error.response?.data || error.message
        }
    },

    async login(email, password) {
        try {

            const response = await api.post('/auth/login', {
                email,
                password
            })

            if (response.data.token) {
                localStorage.setItem('token', response.data.token)
            }

            // Só salva user se existir
            if (response.data.username) {
                localStorage.setItem(
                    'user',
                    JSON.stringify(response.data.username)
                )
            }

            return response.data

        } catch (error) {
            throw error.response?.data || error.message
        }
    },

    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },

    getToken() {
        return localStorage.getItem('token')
    },

    getUser() {

        try {

            const user = localStorage.getItem('user')

            if (!user || user === "undefined") {
                return null
            }

            return JSON.parse(user)

        } catch (error) {
            return null
        }
    },

    isAuthenticated() {
        return !!this.getToken()
    }
}