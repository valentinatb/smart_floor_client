import { Link } from 'react-router-dom';
import { Building2, BarChart3, AlertTriangle, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Building2 className="w-20 h-20 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-text-primary mb-6">
              SmartFloors
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Sistema inteligente de monitoreo de edificios con detección automática de anomalías 
              y recomendaciones generadas por IA
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors flex items-center gap-2"
              >
                Ir al Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
          Características Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-background-panel rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
            <BarChart3 className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Monitoreo en Tiempo Real
            </h3>
            <p className="text-text-secondary">
              Visualiza métricas de temperatura, humedad y energía en tiempo real
            </p>
          </div>

          <div className="bg-background-panel rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
            <AlertTriangle className="w-12 h-12 text-error mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Detección de Anomalías
            </h3>
            <p className="text-text-secondary">
              Sistema automático de alertas con niveles de severidad
            </p>
          </div>

          <div className="bg-background-panel rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
            <Zap className="w-12 h-12 text-primary-secondary mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Recomendaciones IA
            </h3>
            <p className="text-text-secondary">
              Sugerencias inteligentes generadas por Gemini AI
            </p>
          </div>

          <div className="bg-background-panel rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
            <Building2 className="w-12 h-12 text-action mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Gestión Multi-Edificio
            </h3>
            <p className="text-text-secondary">
              Administra múltiples edificios y pisos desde un solo panel
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-background-panel border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-text-secondary mb-8">
            Accede al dashboard para ver el estado de tus edificios
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors"
          >
            Ver Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}