import { useState, useMemo } from "react"
import { Thermometer, Droplets, Zap, AlertTriangle, CheckCircle2, Info, AlertCircle, Filter } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import  Layout from "../../hocs/Layout";
// Mock data generator
const generateTrendData = () => {
  const data = []
  const now = new Date()
  for (let i = 12; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 20 * 60000) // 20-minute intervals
    data.push({
      time: time.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      piso1Temp: 22 + Math.random() * 3,
      piso2Temp: 23 + Math.random() * 4,
      piso3Temp: 21 + Math.random() * 2.5,
      piso1Hum: 45 + Math.random() * 10,
      piso2Hum: 50 + Math.random() * 8,
      piso3Hum: 48 + Math.random() * 12,
      piso1Energy: 15 + Math.random() * 5,
      piso2Energy: 20 + Math.random() * 8,
      piso3Energy: 12 + Math.random() * 4,
    })
  }
  return data
}

const mockAlerts = [
  { id: 1, timestamp: "2025-01-11 14:35", piso: 2, variable: "temperatura", nivel: "Crítica", recomendacion: "Temperatura elevada. Verificar sistema de climatización." },
  { id: 2, timestamp: "2025-01-11 14:20", piso: 1, variable: "humedad", nivel: "Media", recomendacion: "Humedad por encima del rango óptimo. Revisar ventilación." },
  { id: 3, timestamp: "2025-01-11 14:10", piso: 3, variable: "energía", nivel: "Informativa", recomendacion: "Consumo energético estable. Sin acción requerida." },
  { id: 4, timestamp: "2025-01-11 13:55", piso: 2, variable: "riesgo", nivel: "Media", recomendacion: "Riesgo de sobrecarga detectado. Monitorear carga eléctrica." },
  { id: 5, timestamp: "2025-01-11 13:40", piso: 1, variable: "temperatura", nivel: "Informativa", recomendacion: "Temperatura dentro del rango normal." },
  { id: 6, timestamp: "2025-01-11 13:25", piso: 3, variable: "humedad", nivel: "Crítica", recomendacion: "Humedad crítica. Activar deshumidificadores inmediatamente." },
]

const floorData = {
  1: { estado: "Media", temperatura: 24.5, humedad: 52, energia: 18.3, resumen: "Humedad ligeramente elevada" },
  2: { estado: "Crítica", temperatura: 26.8, humedad: 55, energia: 24.1, resumen: "Temperatura crítica detectada" },
  3: { estado: "OK", temperatura: 22.1, humedad: 48, energia: 14.2, resumen: "Todos los parámetros normales" },
}

const getStatusColor = (status) => {
  switch (status) {
    case "OK":
      return "bg-success text-white"
    case "Informativa":
      return "bg-action text-white"
    case "Media":
      return "bg-primary-secondary text-white"
    case "Crítica":
      return "bg-error text-white"
    default:
      return "bg-text-secondary text-white"
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case "OK":
      return <CheckCircle2 className="w-5 h-5" />
    case "Informativa":
      return <Info className="w-5 h-5" />
    case "Media":
      return <AlertTriangle className="w-5 h-5" />
    case "Crítica":
      return <AlertCircle className="w-5 h-5" />
    default:
      return null
  }
}

export default function Dashboard() {
  const [selectedFloor, setSelectedFloor] = useState("Todos")
  const [selectedAlertLevel, setSelectedAlertLevel] = useState("Todos")
  const trendData = useMemo(() => generateTrendData(), [])

  const filteredAlerts = useMemo(() => {
    return mockAlerts.filter((alert) => {
      const floorMatch = selectedFloor === "Todos" || alert.piso.toString() === selectedFloor
      const levelMatch = selectedAlertLevel === "Todos" || alert.nivel === selectedAlertLevel
      return floorMatch && levelMatch
    })
  }, [selectedFloor, selectedAlertLevel])

  return (
    <Layout>
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-background-panel rounded-lg shadow-sm p-6 border border-border">
          <h1 className="text-3xl font-bold text-text-primary">SmartFloors</h1>
          <p className="text-text-secondary mt-1">Panel de Administración y Monitoreo</p>
        </div>

        {/* Floor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(floorData).map(([floor, data]) => (
            <div
              key={floor}
              className="bg-background-panel rounded-lg shadow-sm p-6 border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">Piso {floor}</h2>
                  <p className="text-sm text-text-secondary mt-1">{data.resumen}</p>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                    data.estado
                  )}`}
                >
                  {getStatusIcon(data.estado)}
                  <span>{data.estado}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Thermometer className="w-4 h-4 text-error" />
                    <span className="text-sm">Temperatura</span>
                  </div>
                  <span className="font-semibold text-text-primary">{data.temperatura}°C</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Droplets className="w-4 h-4 text-action" />
                    <span className="text-sm">Humedad</span>
                  </div>
                  <span className="font-semibold text-text-primary">{data.humedad}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Zap className="w-4 h-4 text-primary-secondary" />
                    <span className="text-sm">Energía</span>
                  </div>
                  <span className="font-semibold text-text-primary">{data.energia} kW</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
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
                <Legend wrapperStyle={{ fontSize: "12px", color: "var(--color-text-secondary)" }} />
                <Line type="monotone" dataKey="piso1Temp" name="Piso 1" stroke="var(--color-error)" strokeWidth={2} />
                <Line type="monotone" dataKey="piso2Temp" name="Piso 2" stroke="var(--color-primary-secondary)" strokeWidth={2} />
                <Line type="monotone" dataKey="piso3Temp" name="Piso 3" stroke="var(--color-success)" strokeWidth={2} />
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
                <Legend wrapperStyle={{ fontSize: "12px", color: "var(--color-text-secondary)" }} />
                <Line type="monotone" dataKey="piso1Hum" name="Piso 1" stroke="var(--color-error)" strokeWidth={2} />
                <Line type="monotone" dataKey="piso2Hum" name="Piso 2" stroke="var(--color-primary-secondary)" strokeWidth={2} />
                <Line type="monotone" dataKey="piso3Hum" name="Piso 3" stroke="var(--color-success)" strokeWidth={2} />
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
                <Legend wrapperStyle={{ fontSize: "12px", color: "var(--color-text-secondary)" }} />
                <Line type="monotone" dataKey="piso1Energy" name="Piso 1" stroke="var(--color-error)" strokeWidth={2} />
                <Line type="monotone" dataKey="piso2Energy" name="Piso 2" stroke="var(--color-primary-secondary)" strokeWidth={2} />
                <Line type="monotone" dataKey="piso3Energy" name="Piso 3" stroke="var(--color-success)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

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
                  <option value="1">Piso 1</option>
                  <option value="2">Piso 2</option>
                  <option value="3">Piso 3</option>
                </select>
              </div>
              <select
                value={selectedAlertLevel}
                onChange={(e) => setSelectedAlertLevel(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background-panel text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Todos">Todos los niveles</option>
                <option value="OK">OK</option>
                <option value="Informativa">Informativa</option>
                <option value="Media">Media</option>
                <option value="Crítica">Crítica</option>
              </select>
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
                    <td className="py-3 px-4 text-sm text-text-secondary">{alert.timestamp}</td>
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
  )
}
