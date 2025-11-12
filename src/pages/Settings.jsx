import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, Plus, Trash2, RefreshCw } from "lucide-react";
import Layout from "../hocs/Layout";
import api from "../services/api";

export default function Settings() {
  const [thresholds, setThresholds] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    floor_id: "",
    variable: "temperature",
    lower: "",
    upper: "",
    is_active: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [thresholdsData, floorsData] = await Promise.all([
        api.getThresholds(),
        api.getFloors(),
      ]);
      setThresholds(thresholdsData || []);
      setFloors(floorsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createThreshold({
        ...formData,
        lower: parseFloat(formData.lower),
        upper: parseFloat(formData.upper),
        floor_id: parseInt(formData.floor_id),
      });
      setShowForm(false);
      setFormData({
        floor_id: "",
        variable: "temperature",
        lower: "",
        upper: "",
        is_active: true,
      });
      fetchData();
    } catch (err) {
      console.error('Error creating threshold:', err);
      alert('Error al crear el umbral');
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
                <SettingsIcon className="w-8 h-8 text-primary" />
                Configuración de Umbrales
              </h1>
              <p className="text-text-secondary mt-1">Gestiona los umbrales personalizados para cada piso</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 rounded-lg border border-border hover:bg-background transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-text-primary ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nuevo Umbral
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-error/10 border border-error rounded-lg p-4 text-error">
              Error: {error}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="bg-background-panel rounded-lg shadow-sm p-6 border border-border">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Crear Nuevo Umbral</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Piso</label>
                    <select
                      value={formData.floor_id}
                      onChange={(e) => setFormData({ ...formData, floor_id: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Seleccionar piso</option>
                      {floors.map((floor) => (
                        <option key={floor.id} value={floor.id}>
                          {floor.name} (Edificio {floor.building_id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Variable</label>
                    <select
                      value={formData.variable}
                      onChange={(e) => setFormData({ ...formData, variable: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="temperature">Temperatura</option>
                      <option value="humidity">Humedad</option>
                      <option value="energy">Energía</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Límite Inferior</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.lower}
                      onChange={(e) => setFormData({ ...formData, lower: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Límite Superior</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.upper}
                      onChange={(e) => setFormData({ ...formData, upper: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="is_active" className="text-sm text-text-primary">
                    Activo
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-background-panel transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Thresholds Table */}
          <div className="bg-background-panel rounded-lg shadow-sm border border-border overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-text-secondary">Cargando umbrales...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Piso</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Variable</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Límite Inferior</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Límite Superior</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {thresholds.map((threshold) => (
                      <tr key={threshold.id} className="border-b border-border hover:bg-background transition-colors">
                        <td className="py-3 px-4 text-sm text-text-secondary">{threshold.id}</td>
                        <td className="py-3 px-4 text-sm font-medium text-text-primary">Piso {threshold.floor_id}</td>
                        <td className="py-3 px-4 text-sm text-text-secondary capitalize">{threshold.variable}</td>
                        <td className="py-3 px-4 text-sm text-text-secondary">{threshold.lower}</td>
                        <td className="py-3 px-4 text-sm text-text-secondary">{threshold.upper}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${threshold.is_active ? 'bg-success text-white' : 'bg-text-secondary text-white'}`}>
                            {threshold.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {thresholds.length === 0 && (
                  <div className="text-center py-8 text-text-secondary">
                    No hay umbrales configurados. Crea uno nuevo para comenzar.
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
