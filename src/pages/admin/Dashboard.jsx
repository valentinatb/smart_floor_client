import { useState, useEffect, useMemo } from "react";
import { Thermometer, Droplets, Zap, AlertTriangle, CheckCircle2, Info, AlertCircle, Filter, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Layout from "../../hocs/Layout";
import api from "../../services/api";

const getStatusColor = (status) => {
  switch (status) {
    case "OK":
      return "bg-success text-white";
    case "Informativa":
      return "bg-action text-white";
    case "Media":
      return "bg-primary-secondary text-white";
    case "Crítica":
      return "bg-error text-white";
    default:
      return "bg-text-secondary text-white";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "OK":
      return <CheckCircle2 className="w-5 h-5" />;
    case "Informativa":
      return <Info className="w-5 h-5" />;
    case "Media":
      return <AlertTriangle className="w-5 h-5" />;
    case "Crítica":
      return <AlertCircle className="w-5 h-5" />;
    default:
      return null;
  }
};

export default function Dashboard() {
  const [selectedBuilding, setSelectedBuilding] = useState("A");
  const [selectedFloor, setSelectedFloor] = useState("Todos");
  const [cards, setCards] = useState([]);
  const [trends, setTrends] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch cards (floor status)
      const cardsData = await api.getCards(selectedBuilding);
      setCards(cardsData || []);

      // Fetch alerts
      const alertsData = await api.getAlertsByBuilding(selectedBuilding, {
        status: 'open',
        limit: 50
      });
      setAlerts(alertsData || []);

      // Fetch trends for first floor if available
      if (cardsData && cardsData.length > 0) {
        const firstFloor = cardsData[0].piso;
        const trendsData = await api.getTrends(selectedBuilding, firstFloor, 4);
        setTrends(trendsData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedBuilding]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const floorMatch = selectedFloor === "Todos" || alert.piso?.toString() === selectedFloor;
      return floorMatch;
    });
  }, [alerts, selectedFloor]);

  const trendData = useMemo(() => {
    if (!trends || !trends.timestamps) return [];
    return trends.timestamps.map((ts, idx) => ({
      time: new Date(ts).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      temp_C: trends.temp_C?.[idx] || 0,
      humedad_pct: trends.humedad_pct?.[idx] || 0,
      energia_kW: trends.energia_kW?.[idx] || 0,
    }));
  }, [trends]);

  const availableFloors = useMemo(() => {
    return cards.map(card => card.piso);
  }, [cards]);

  if (loading && cards.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen p-6 bg-background flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-text-secondary">Cargando datos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-background">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-background-panel rounded-lg shadow-sm p-6 border border-border flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">SmartFloors</h1>
              <p className="text-text-secondary mt-1">Panel de Administración y Monitoreo</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background-panel text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="A">Edificio A</option>
                <option value="B">Edificio B</option>
              </select>
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 rounded-lg border border-border hover:bg-background-panel transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-text-primary ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-error/10 border border-error rounded-lg p-4 text-error">
              Error: {error}
            </div>
          )}

          {/* Floor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.piso}
                className="bg-background-panel rounded-lg shadow-sm p-6 border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">Piso {card.piso}</h2>
                    <p className="text-sm text-text-secondary mt-1">{card.resumen}</p>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                      card.estado
                    )}`}
                  >
                    {getStatusIcon(card.estado)}
                    <span>{card.estado}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {card.valores && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Thermometer className="w-4 h-4 text-error" />
                          <span className="text-sm">Temperatura</span>
                        </div>
                        <span className="font-semibold text-text-primary">{card.valores.temp_C?.toFixed(1) || 'N/A'}°C</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Droplets className="w-4 h-4 text-action" />
                          <span className="text-sm">Humedad</span>
                        </div>
                        <span className="font-semibold text-text-primary">{card.valores.humedad_pct?.toFixed(1) || 'N/A'}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Zap className="w-4 h-4 text-primary-secondary" />
                          <span className="text-sm">Energía</span>
                        </div>
                        <span className="font-semibold text-text-primary">{card.valores.energia_kW?.toFixed(1) || 'N/A'} kW</span>
                      </div>
                    </>
                  )}

                  {card.detalle && (
                    <div className="mt-4 pt-4 border-t border-border space-y-2">
                      {card.detalle.temperatura && (
                        <div className="text-xs text-text-secondary">
                          <span className="font-medium">Temp: </span>
                          {card.detalle.temperatura.recomendacion}
                        </div>
                      )}
                      {card.detalle.humedad && (
                        <div className="text-xs text-text-secondary">
                          <span className="font-medium">Humedad: </span>
                          {card.detalle.humedad.recomendacion}
                        </div>
                      )}
                      {card.detalle.energia && (
                        <div className="text-xs text-text-secondary">
                          <span className="font-medium">Energía: </span>
                          {card.detalle.energia.recomendacion}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          {trendData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Temperature Chart */}
              <div className="bg-background-panel rounded-lg shadow-sm p-6 border border-border">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-error" />
                  Temperatura (°C)
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="time" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-background-panel)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "0.5rem",
                        color: "var(--color-text-primary)",
                      }}
                    />
                    <Line type="monotone" dataKey="temp_C" name="Temp (°C)" stroke="var(--color-error)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Humidity Chart */}
              <div className="bg-background-panel rounded-lg shadow-sm p-6 border border-border">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-action" />
                  Humedad (%)
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="time" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-background-panel)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "0.5rem",
                        color: "var(--color-text-primary)",
                      }}
                    />
                    <Line type="monotone" dataKey="humedad_pct" name="Humedad (%)" stroke="var(--color-action)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Energy Chart */}
              <div className="bg-background-panel rounded-lg shadow-sm p-6 border border-border">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary-secondary" />
                  Energía (kW)
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="time" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-background-panel)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "0.5rem",
                        color: "var(--color-text-primary)",
                      }}
                    />
                    <Line type="monotone" dataKey="energia_kW" name="Energía (kW)" stroke="var(--color-primary-secondary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Alerts Section */}
          <div className="bg-background-panel rounded-lg shadow-sm p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary-secondary" />
                Alertas y Recomendaciones
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-text-secondary" />
                  <select
                    value={selectedFloor}
                    onChange={(e) => setSelectedFloor(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg text-sm bg-background-panel text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Todos">Todos los pisos</option>
                    {availableFloors.map(floor => (
                      <option key={floor} value={floor.toString()}>Piso {floor}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Timestamp</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Piso</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Variable</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Nivel</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Recomendación</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-border hover:bg-background transition-colors">
                      <td className="py-3 px-4 text-sm text-text-secondary">
                        {new Date(alert.timestamp).toLocaleString('es-ES')}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-text-primary">Piso {alert.piso}</td>
                      <td className="py-3 px-4 text-sm text-text-secondary capitalize">{alert.variable}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.nivel)}`}>
                          {getStatusIcon(alert.nivel)}
                          {alert.nivel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-secondary">{alert.recomendacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAlerts.length === 0 && (
                <div className="text-center py-8 text-text-secondary">
                  No se encontraron alertas con los filtros seleccionados
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
