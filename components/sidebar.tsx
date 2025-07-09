"use client"
import { Truck, Package, Mic, ClipboardList, Settings, Box, MapPin, BatteryCharging } from "lucide-react"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  canAccessTaskPanel: boolean
  canViewInventory: boolean
  t: (key: string) => string
}

export function Sidebar({ activeSection, setActiveSection, canAccessTaskPanel, canViewInventory, t }: SidebarProps) {
  const menuItems = [
    { id: "delivery", icon: Package, label: t("deliveryDashboard"), enabled: true },
    { id: "task", icon: ClipboardList, label: t("taskPanel"), enabled: canAccessTaskPanel },
    { id: "voice", icon: Mic, label: t("voiceCommand"), enabled: true },
    { id: "inventory", icon: Box, label: t("inventoryAutoUpdate"), enabled: canViewInventory },
    { id: "hospitalLayout", icon: MapPin, label: t("hospitalLayout"), enabled: true },
    { id: "robotFleet", icon: BatteryCharging, label: t("robotFleetOverview"), enabled: true },
  ]

  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col rounded-r-2xl m-4">
      <div className="flex items-center mb-10">
        <Truck className="text-blue-600 mr-2" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">HospiGo</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                disabled={!item.enabled}
              >
                <item.icon className="mr-3" size={20} />
                {item.label}
                {!item.enabled && <span className="ml-2 text-red-500 text-xs">(Restricted)</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <button className="flex items-center w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors duration-200">
          <Settings className="mr-3" size={20} />
          {t("settings")}
        </button>
      </div>
    </aside>
  )
}
