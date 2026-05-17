import api from './api'

export const routeService = {
  async getAllRoutes() {
    try {
      const response = await api.get('/routes')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async getRouteById(routeId) {
    try {
      const response = await api.get(`/routes/${routeId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}
