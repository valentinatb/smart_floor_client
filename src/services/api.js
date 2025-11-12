const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Buildings
  async getBuildings() {
    return this.request('/buildings/');
  }

  async createBuilding(code) {
    return this.request('/buildings/', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // Floors
  async getFloors() {
    return this.request('/floors/');
  }

  async createFloor(buildingId, name, number) {
    return this.request('/floors/', {
      method: 'POST',
      body: JSON.stringify({ building_id: buildingId, name, number }),
    });
  }

  // Metrics
  async ingestMetrics(data) {
    return this.request('/metrics/ingest', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMetrics(edificio, piso, params = {}) {
    const queryParams = new URLSearchParams({
      edificio,
      piso: piso.toString(),
      ...params,
    });
    return this.request(`/metrics/?${queryParams}`);
  }

  async getTrends(edificio, piso, hours = 4) {
    return this.request(`/metrics/trends?edificio=${edificio}&piso=${piso}&hours=${hours}`);
  }

  async getCards(edificio) {
    return this.request(`/metrics/cards?edificio=${edificio}`);
  }

  async uploadCSV(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/metrics/upload-csv', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }

  // Alerts
  async getAlerts(params = {}) {
    const queryParams = new URLSearchParams(params);
    return this.request(`/alerts/?${queryParams}`);
  }

  async getAlertsByBuilding(edificio, params = {}) {
    const queryParams = new URLSearchParams({ edificio, ...params });
    return this.request(`/alerts/by-building?${queryParams}`);
  }

  async getAlertStats(edificio, hours = 24) {
    return this.request(`/alerts/stats?edificio=${edificio}&hours=${hours}`);
  }

  async updateAlertStatus(alertId, status) {
    return this.request(`/alerts/${alertId}/status?status=${status}`, {
      method: 'PATCH',
    });
  }

  async createAlert(data) {
    return this.request('/alerts/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Thresholds
  async getThresholds() {
    return this.request('/thresholds/');
  }

  async createThreshold(data) {
    return this.request('/thresholds/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();