import { useState, useEffect } from "react";
import { AlertTriangle, Filter, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import Layout from "../hocs/Layout";
import api from "../services/api";

const getStatusColor = (status) => {
  switch (status) {
    case "open":
      return "bg-error text-white";
    case "acknowledged":
      return "bg-primary-secondary text-white";
    case "closed":
      return "bg-success text-white";
    default:
      return "bg-text-secondary text-white";
  }
};

const getLevelColor = (level) => {
  switch (level) {
    case "critical":
      return "bg-error text-white";
    case "medium":
      return "bg-primary-secondary text-white";
    case "info":
      return "bg-action text-white";
    default:
      return "bg-text-secondary text-white";
  }
};

export default function Alerts() {
  const [selectedBuilding, setSelectedBuilding] = useState("A");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("open");
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        status: selectedStatus,
        limit: 200,
      };
      if (selectedFloor) params.piso = selectedFloor;
      if (selectedLevel) params.nivel = selectedLevel;

      const data = await api.getAlertsByBuilding(selectedBuilding, params);
      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.getAlertStats(selectedBuilding, 24);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchStats();
  }, [selectedBuilding, selectedFloor, selectedLevel, selectedStatus]);

  const handleStatusChange = async (alertId, newStatus) => {
    try {
      await api.updateAlertStatus(alertId, newStatus);
      fetchAlerts();
      fetchStats();
    } catch (err) {
      console.error('Error updating alert status:', err);
      alert('Error al actualizar el estado de la alerta');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-background">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-background-panel rounded-lg shadow-sm p-6 border border-border flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
                <AlertTriangle className="w-8 h-8 text-error" />
                Gestión de Alertas
              </h1>
              <p className="text-text-secondary mt-1">Monitorea y gestiona todas las alertas del sistema</p>
            </div>
            <button
              onClick={fetchAlerts}
              disabled={loading}
              className="p-2 rounded-lg border border-border hover:bg-background-panel transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-text-primary ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-background-panel rounded-lg p-4 border border-border">
                <div className="text-sm text-text-secondary mb-1">Total Alertas</div>
                <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
              </div>
              <div className="bg-background-panel rounded-lg p-4 border border-border">
                <div className="text-sm text-text-secondary mb-1">Críticas</div>
                <div className="text-2xl font-bold text-error">{stats.por_nivel?.critical || 0}</div>
              </div>
              <div className="bg-background-panel rounded-lg p-4 border border-border">
                <div className="text-sm text-text-secondary mb-1">Abiertas</div>
                <div className="text-2xl font-bold text-primary-secondary">{stats.por_status?.open || 0}</div>
              </div>
              <div className="bg-background-panel rounded-lg p-4 border border-border">
                <div className="text-sm text-text-secondary mb-1">Reconocidas</div>
                <div className="text-2xl font-bold text-action">{stats.por_status?.acknowledged || 0}</div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-background-panel rounded-lg shadow-sm p-6 border border-border">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-text-secondary" />
                <span className="text-sm font-medium text-text-primary">Filtros:</span>
              </div>
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="A">Edificio A</option>
                <option value="B">Edificio B</option>
              </select>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos los pisos</option>
                <option value="1">Piso 1</option>
                <option value="2">Piso 2</option>
                <option value="3">Piso 3</option>
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos los niveles</option>
                <option value="info">Informativa</option>
                <option value="medium">Media</option>
                <option value="critical">Crítica</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="open">Abiertas</option>
                <option value="acknowledged">Reconocidas</option>
                <option value="closed">Cerradas</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-error/10 border border-error rounded-lg p-4 text-error">
              Error: {error}
            </div>
          )}

          {/* Alerts Table */}
          <div className="bg-background-panel rounded-lg shadow-sm border border-border overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-text-secondary">Cargando alertas...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Timestamp</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Piso</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Variable</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Nivel</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Mensaje</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Recomendación</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert) => (
                      <tr key={alert.id} className="border-b border-border hover:bg-background transition-colors">
                        <td className="py-3 px-4 text-sm text-text-secondary">
                          {new Date(alert.timestamp).toLocaleString('es-ES')}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-text-primary">Piso {alert.piso}</td>
                        <td className="py-3 px-4 text-sm text-text-secondary capitalize">{alert.variable}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getLevelColor(alert.nivel)}`}>
                            {alert.nivel}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                            {alert.status === 'open' && <Clock className="w-3 h-3" />}
                            {alert.status === 'acknowledged' && <CheckCircle2 className="w-3 h-3" />}
                            {alert.status === 'closed' && <XCircle className="w-3 h-3" />}
                            {alert.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-secondary">{alert.mensaje}</td>
                        <td className="py-3 px-4 text-sm text-text-secondary max-w-md">{alert.recomendacion}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {alert.status === 'open' && (
                              <button
                                onClick={() => handleStatusChange(alert.id, 'acknowledged')}
                                className="px-3 py-1 text-xs bg-primary-secondary text-white rounded hover:bg-primary-secondary/80 transition-colors"
                              >
                                Reconocer
                              </button>
                            )}
                            {alert.status !== 'closed' && (
                              <button
                                onClick={() => handleStatusChange(alert.id, 'closed')}
                                className="px-3 py-1 text-xs bg-success text-white rounded hover:bg-success/80 transition-colors"
                              >
                                Cerrar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {alerts.length === 0 && (
                  <div className="text-center py-8 text-text-secondary">
                    No se encontraron alertas con los filtros seleccionados
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
