import { useState } from "react"
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  AlertTriangle,
  FileText,
  BarChart3,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

const defaultItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "floors",
    label: "Pisos",
    icon: Building2,
    path: "/floors",
    badge: 3,
  },
  {
    id: "alerts",
    label: "Alertas",
    icon: AlertTriangle,
    path: "/alerts",
    badge: 5,
  },
  {
    id: "reports",
    label: "Reportes",
    icon: FileText,
    children: [
      {
        id: "reports-daily",
        label: "Diarios",
        icon: BarChart3,
        path: "/reports/daily",
      },
      {
        id: "reports-monthly",
        label: "Mensuales",
        icon: BarChart3,
        path: "/reports/monthly",
      },
    ],
  },
  {
    id: "users",
    label: "Usuarios",
    icon: Users,
    path: "/users",
  },
  {
    id: "settings",
    label: "Configuración",
    icon: Settings,
    path: "/settings",
  },
]

export function Sidebar({
  items = defaultItems,
  onNavigate,
  activePath = "/dashboard",
  collapsed = false,
  onToggleCollapse,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState([])

  const toggleExpanded = (id) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleNavigate = (path) => {
    if (onNavigate) onNavigate(path)
    setMobileOpen(false)
  }

  const renderItem = (item, depth = 0) => {
    const isActive = activePath === item.path
    const isExpanded = expandedItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0
    const Icon = item.icon

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else if (item.path) {
              handleNavigate(item.path)
            }
          }}
          className={`
            w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all
            ${depth > 0 ? "ml-4" : ""}
            ${isActive ? "bg-primary text-white" : "text-text-primary hover:bg-background-panel"}
          `}
        >
          <div className="flex items-center gap-3 flex-1">
            {Icon && <Icon className={`w-5 h-5 flex-shrink-0 ${collapsed ? "mx-auto" : ""}`} />}
            {!collapsed && <span className="font-medium text-sm truncate">{item.label}</span>}
          </div>
          {!collapsed && (
            <>
              {item.badge && !hasChildren && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-error text-white">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <span className="text-text-secondary">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
              )}
            </>
          )}
        </button>

        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">{(item.children || []).map((child) => renderItem(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-borders)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <h2 className="font-bold text-lg text-text-primary">SmartFloors</h2>
              <p className="text-xs text-text-secondary">Admin Panel</p>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            if (onToggleCollapse) onToggleCollapse()
            setMobileOpen(false)
          }}
          className="p-2 rounded-lg hover:bg-background-panel text-text-primary lg:block hidden"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">{items.map((item) => renderItem(item))}</nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[var(--color-borders)]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background-panel">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-text-primary truncate">Admin User</p>
              <p className="text-xs text-text-secondary truncate">admin@smartfloors.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-background-panel border border-[var(--color-borders)] text-text-primary lg:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Desktop Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-background-panel border-r border-[var(--color-borders)] z-40 transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Spacer for main content */}
      <div className={collapsed ? "lg:w-20" : "lg:w-64"} />
    </>
  )
}
