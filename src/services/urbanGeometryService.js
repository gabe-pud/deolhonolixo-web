import api from './api'

export const urbanGeometryService = {
  async getAllUrbanGeometry() {
    try {
      const response = await api.get('/urban-geometry')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async getUrbanGeometryByName(name) {
    try {
      const response = await api.get(`/urban-geometry/${name}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}
