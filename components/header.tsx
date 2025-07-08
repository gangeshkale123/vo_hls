"use client"
import { Search, Globe, User, Bell, XCircle } from "lucide-react"

interface HeaderProps {
  selectedLanguage: string
  setSelectedLanguage: (lang: string) => void
  currentUserRole: string
  notifications: any[]
  setShowNotifications: (show: boolean) => void
  emergencyStopped: boolean
  handleEmergencyStop: () => void
  handleResumeRobots: () => void
  t: (key: string) => string
}

export function Header({
  selectedLanguage,
  setSelectedLanguage,
  currentUserRole,
  notifications,
  setShowNotifications,
  emergencyStopped,
  handleEmergencyStop,
  handleResumeRobots,
  t,
}: HeaderProps) {
  return (
    <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-6">
      <div className="flex items-center">
        <Search className="text-gray-400 mr-3" size={20} />
        <input type="text" placeholder={t("search")} className="outline-none text-gray-700 placeholder-gray-400 w-64" />
      </div>

      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-300 rounded-full py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
          <Globe className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
        </div>

        {/* User Role Display */}
        <div className="flex items-center">
          <User className="text-gray-600 mr-2" size={20} />
          <span className="font-medium text-gray-700">{currentUserRole}</span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => setShowNotifications(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
          aria-label={t("notifications")}
        >
          <Bell className="text-gray-600" size={20} />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center -mt-1 -mr-1 ring-2 ring-white">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Emergency Stop */}
        <button
          onClick={handleEmergencyStop}
          className={`flex items-center px-4 py-2 rounded-xl font-semibold text-white transition-colors duration-200 shadow-md
            ${emergencyStopped ? "bg-gray-500 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"}
          `}
          aria-label={t("emergencyStop")}
        >
          <XCircle className="mr-2" size={20} />
          {emergencyStopped ? "Halted!" : t("emergencyStop")}
        </button>

        {emergencyStopped && (
          <button
            onClick={handleResumeRobots}
            className="flex items-center px-4 py-2 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-md"
          >
            Resume
          </button>
        )}

        <div className="flex items-center">
          <img
            src="https://placehold.co/40x40/cbd5e1/2d3748?text=U"
            alt="User Avatar"
            className="w-10 h-10 rounded-full mr-2"
          />
          <span className="font-medium text-gray-700">{t("authorizedStaff")}</span>
        </div>
      </div>
    </header>
  )
}
