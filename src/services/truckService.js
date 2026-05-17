import api from './api'

export const truckService = {
  async registerTruck(licensePlate) {
    try {
      const response = await api.post('/trucks/register', { licensePlate })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async getAllTrucks() {
    try {
      const response = await api.get('/trucks')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async getTruckByLicensePlate(licensePlate) {
    try {
      const response = await api.get(`/trucks/${licensePlate}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async getTruckHistory(truckId) {
    try {
      const response = await api.get(`/trucks/history/${truckId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async getAllTrucksHistory() {
    try {
      const response = await api.get('/trucks/history')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async getTruckGeolocation(truckId) {
    try {
      const response = await api.get(`/trucks/geolocation/${truckId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}
