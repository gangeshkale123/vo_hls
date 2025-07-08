"use client"

import { useState, useEffect } from "react"
import {
  BatteryCharging,
  Thermometer,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Zap,
  Navigation,
  Settings,
  Activity,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Power,
  MapPin,
  Package,
  Wrench,
} from "lucide-react"

interface RobotData {
  id: string
  name: string
  model: string
  status: "idle" | "active" | "charging" | "maintenance" | "offline" | "emergency"
  battery: number
  batteryHealth: number
  temperature: number
  signalStrength: number
  location: string
  currentTask?: string
  tasksCompleted: number
  totalDistance: number
  uptime: number
  lastMaintenance: string
  nextMaintenance: string
  errorCount: number
  efficiency: number
  loadCapacity: number
  currentLoad: number
  chargingRate?: number
  estimatedChargeTime?: number
  softwareVersion: string
  lastUpdate: string
}

interface FleetStats {
  totalRobots: number
  activeRobots: number
  averageBattery: number
  totalTasksToday: number
  totalDistanceToday: number
  averageEfficiency: number
  robotsNeedingMaintenance: number
  criticalAlerts: number
}

interface RobotFleetProps {
  t: (key: string) => string
}

export function RobotFleet({ t }: RobotFleetProps) {
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name" | "battery" | "efficiency" | "tasks">("name")

  const [robots, setRobots] = useState<RobotData[]>([
    {
      id: "robot-a",
      name: "Robot A",
      model: "MediBot Pro 3000",
      status: "active",
      battery: 85,
      batteryHealth: 92,
      temperature: 42,
      signalStrength: 95,
      location: "Ward A - Room 101",
      currentTask: "Medication Delivery",
      tasksCompleted: 23,
      totalDistance: 12.4,
      uptime: 14.5,
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-02-15",
      errorCount: 2,
      efficiency: 94,
      loadCapacity: 15,
      currentLoad: 8,
      softwareVersion: "v2.1.3",
      lastUpdate: "2024-01-20 09:30",
    },
    {
      id: "robot-b",
      name: "Robot B",
      model: "MediBot Pro 3000",
      status: "charging",
      battery: 25,
      batteryHealth: 88,
      temperature: 38,
      signalStrength: 87,
      location: "Charging Station 1",
      tasksCompleted: 31,
      totalDistance: 18.7,
      uptime: 16.2,
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      errorCount: 1,
      efficiency: 91,
      loadCapacity: 15,
      currentLoad: 0,
      chargingRate: 2.5,
      estimatedChargeTime: 45,
      softwareVersion: "v2.1.3",
      lastUpdate: "2024-01-20 09:25",
    },
    {
      id: "robot-c",
      name: "Robot C",
      model: "MediBot Lite 2000",
      status: "maintenance",
      battery: 60,
      batteryHealth: 76,
      temperature: 45,
      signalStrength: 92,
      location: "Maintenance Bay",
      tasksCompleted: 19,
      totalDistance: 9.8,
      uptime: 12.1,
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-02-20",
      errorCount: 5,
      efficiency: 78,
      loadCapacity: 10,
      currentLoad: 0,
      softwareVersion: "v2.0.8",
      lastUpdate: "2024-01-20 08:15",
    },
    {
      id: "robot-d",
      name: "Robot D",
      model: "MediBot Pro 3000",
      status: "idle",
      battery: 78,
      batteryHealth: 95,
      temperature: 40,
      signalStrength: 89,
      location: "Storage Room",
      tasksCompleted: 27,
      totalDistance: 15.2,
      uptime: 15.8,
      lastMaintenance: "2024-01-18",
      nextMaintenance: "2024-02-18",
      errorCount: 0,
      efficiency: 96,
      loadCapacity: 15,
      currentLoad: 0,
      softwareVersion: "v2.1.3",
      lastUpdate: "2024-01-20 09:32",
    },
  ])

  const [fleetStats, setFleetStats] = useState<FleetStats>({
    totalRobots: 4,
    activeRobots: 2,
    averageBattery: 62,
    totalTasksToday: 100,
    totalDistanceToday: 56.1,
    averageEfficiency: 90,
    robotsNeedingMaintenance: 1,
    criticalAlerts: 2,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRobots((prevRobots) =>
        prevRobots.map((robot) => {
          const updates: Partial<RobotData> = {}

          // Update battery based on status
          if (robot.status === "charging" && robot.battery < 100) {
            updates.battery = Math.min(100, robot.battery + 1)
            if (robot.chargingRate) {
              updates.estimatedChargeTime = Math.max(0, (robot.estimatedChargeTime || 0) - 1)
            }
          } else if (robot.status === "active" && robot.battery > 0) {
            updates.battery = Math.max(0, robot.battery - 0.2)
          }

          // Update temperature slightly
          updates.temperature = robot.temperature + (Math.random() - 0.5) * 2

          // Update signal strength
          updates.signalStrength = Math.max(70, Math.min(100, robot.signalStrength + (Math.random() - 0.5) * 5))

          // Update tasks completed for active robots
          if (robot.status === "active" && Math.random() < 0.1) {
            updates.tasksCompleted = robot.tasksCompleted + 1
            updates.totalDistance = robot.totalDistance + Math.random() * 0.5
          }

          return { ...robot, ...updates }
        }),
      )

      // Update fleet stats
      setFleetStats((prevStats) => ({
        ...prevStats,
        averageBattery: Math.round(robots.reduce((sum, robot) => sum + robot.battery, 0) / robots.length),
        activeRobots: robots.filter((robot) => robot.status === "active").length,
        totalTasksToday: robots.reduce((sum, robot) => sum + robot.tasksCompleted, 0),
        totalDistanceToday: Math.round(robots.reduce((sum, robot) => sum + robot.totalDistance, 0) * 10) / 10,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [robots])

  const getStatusColor = (status: RobotData["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100"
      case "idle":
        return "text-blue-600 bg-blue-100"
      case "charging":
        return "text-yellow-600 bg-yellow-100"
      case "maintenance":
        return "text-orange-600 bg-orange-100"
      case "offline":
        return "text-gray-600 bg-gray-100"
      case "emergency":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: RobotData["status"]) => {
    switch (status) {
      case "active":
        return <Navigation size={16} />
      case "idle":
        return <CheckCircle size={16} />
      case "charging":
        return <Zap size={16} />
      case "maintenance":
        return <Wrench size={16} />
      case "offline":
        return <Power size={16} />
      case "emergency":
        return <AlertTriangle size={16} />
      default:
        return <Activity size={16} />
    }
  }

  const getBatteryColor = (battery: number, health: number) => {
    if (battery < 20 || health < 80) return "text-red-500"
    if (battery < 50 || health < 90) return "text-yellow-500"
    return "text-green-500"
  }

  const filteredRobots = robots
    .filter((robot) => filterStatus === "all" || robot.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case "battery":
          return b.battery - a.battery
        case "efficiency":
          return b.efficiency - a.efficiency
        case "tasks":
          return b.tasksCompleted - a.tasksCompleted
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleRobotAction = (robotId: string, action: string) => {
    setRobots((prevRobots) =>
      prevRobots.map((robot) => {
        if (robot.id === robotId) {
          switch (action) {
            case "restart":
              return { ...robot, status: "idle", errorCount: 0 }
            case "maintenance":
              return { ...robot, status: "maintenance" }
            case "charge":
              return { ...robot, status: "charging" }
            default:
              return robot
          }
        }
        return robot
      }),
    )
  }

  return (
    <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          <BatteryCharging className="mr-3" size={32} />
          {t("robotFleetOverview")}
        </h2>

        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="charging">Charging</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="battery">Sort by Battery</option>
            <option value="efficiency">Sort by Efficiency</option>
            <option value="tasks">Sort by Tasks</option>
          </select>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-700">Total Robots</h3>
              <p className="text-3xl font-bold text-blue-900">{fleetStats.totalRobots}</p>
            </div>
            <Activity className="text-blue-400" size={40} />
          </div>
          <p className="text-sm text-blue-600 mt-2">{fleetStats.activeRobots} currently active</p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-700">Avg Battery</h3>
              <p className="text-3xl font-bold text-green-900">{fleetStats.averageBattery}%</p>
            </div>
            <BatteryCharging className="text-green-400" size={40} />
          </div>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${fleetStats.averageBattery}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-700">Tasks Today</h3>
              <p className="text-3xl font-bold text-purple-900">{fleetStats.totalTasksToday}</p>
            </div>
            <Package className="text-purple-400" size={40} />
          </div>
          <p className="text-sm text-purple-600 mt-2">{fleetStats.totalDistanceToday}km traveled</p>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-700">Efficiency</h3>
              <p className="text-3xl font-bold text-orange-900">{fleetStats.averageEfficiency}%</p>
            </div>
            <TrendingUp className="text-orange-400" size={40} />
          </div>
          <p className="text-sm text-orange-600 mt-2">{fleetStats.criticalAlerts} alerts pending</p>
        </div>
      </div>

      {/* Robot Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRobots.map((robot) => (
            <div
              key={robot.id}
              className={`bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                selectedRobot === robot.id ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
              }`}
              onClick={() => setSelectedRobot(selectedRobot === robot.id ? null : robot.id)}
            >
              {/* Robot Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{robot.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(robot.status)}`}>
                  <span className="flex items-center">
                    {getStatusIcon(robot.status)}
                    <span className="ml-1 capitalize">{robot.status}</span>
                  </span>
                </span>
              </div>

              {/* Battery Status */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Battery</span>
                  <span className={`text-sm font-bold ${getBatteryColor(robot.battery, robot.batteryHealth)}`}>
                    {robot.battery}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      robot.battery < 20 ? "bg-red-500" : robot.battery < 50 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${robot.battery}%` }}
                  ></div>
                </div>
                {robot.status === "charging" && robot.estimatedChargeTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    {robot.estimatedChargeTime} min remaining (+{robot.chargingRate}%/min)
                  </p>
                )}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <Thermometer size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{Math.round(robot.temperature)}°C</span>
                </div>
                <div className="flex items-center">
                  <Wifi size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{robot.signalStrength}%</span>
                </div>
                <div className="flex items-center">
                  <Package size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{robot.tasksCompleted}</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{robot.efficiency}%</span>
                </div>
              </div>

              {/* Current Status */}
              <div className="border-t pt-3">
                <div className="flex items-center mb-2">
                  <MapPin size={14} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{robot.location}</span>
                </div>
                {robot.currentTask && <div className="text-sm text-blue-600 font-medium">{robot.currentTask}</div>}
              </div>

              {/* Quick Actions */}
              {selectedRobot === robot.id && (
                <div className="mt-4 pt-3 border-t flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRobotAction(robot.id, "restart")
                    }}
                    className="flex-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                  >
                    <RotateCcw size={12} className="inline mr-1" />
                    Restart
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRobotAction(robot.id, "maintenance")
                    }}
                    className="flex-1 px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
                  >
                    <Wrench size={12} className="inline mr-1" />
                    Service
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Robot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Battery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRobots.map((robot) => (
                <tr key={robot.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{robot.name}</div>
                      <div className="text-sm text-gray-500">{robot.model}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(robot.status)}`}>
                      <span className="flex items-center">
                        {getStatusIcon(robot.status)}
                        <span className="ml-1 capitalize">{robot.status}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className={`h-2 rounded-full ${
                            robot.battery < 20 ? "bg-red-500" : robot.battery < 50 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${robot.battery}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getBatteryColor(robot.battery, robot.batteryHealth)}`}>
                        {robot.battery}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{robot.batteryHealth}%</div>
                    <div className="text-sm text-gray-500">{Math.round(robot.temperature)}°C</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{robot.tasksCompleted}</div>
                    <div className="text-sm text-gray-500">{robot.totalDistance}km</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {robot.efficiency >= 90 ? (
                        <TrendingUp className="text-green-500 mr-1" size={16} />
                      ) : (
                        <TrendingDown className="text-red-500 mr-1" size={16} />
                      )}
                      <span className="text-sm text-gray-900">{robot.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{robot.location}</div>
                    {robot.currentTask && <div className="text-sm text-blue-600">{robot.currentTask}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRobotAction(robot.id, "restart")}
                        className="text-blue-600 hover:text-blue-900"
                        title="Restart Robot"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={() => handleRobotAction(robot.id, "maintenance")}
                        className="text-orange-600 hover:text-orange-900"
                        title="Schedule Maintenance"
                      >
                        <Wrench size={16} />
                      </button>
                      <button
                        onClick={() => setSelectedRobot(robot.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Details"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Robot Panel */}
      {selectedRobot && (
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          {(() => {
            const robot = robots.find((r) => r.id === selectedRobot)
            if (!robot) return null

            return (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">{robot.name} - Detailed Information</h3>
                  <button onClick={() => setSelectedRobot(null)} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* System Information */}
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">System Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{robot.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Software:</span>
                        <span className="font-medium">{robot.softwareVersion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Update:</span>
                        <span className="font-medium">{robot.lastUpdate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uptime:</span>
                        <span className="font-medium">{robot.uptime}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Error Count:</span>
                        <span className={`font-medium ${robot.errorCount > 0 ? "text-red-600" : "text-green-600"}`}>
                          {robot.errorCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Efficiency:</span>
                        <span className="font-medium">{robot.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tasks Completed:</span>
                        <span className="font-medium">{robot.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance Traveled:</span>
                        <span className="font-medium">{robot.totalDistance}km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Load Capacity:</span>
                        <span className="font-medium">
                          {robot.currentLoad}/{robot.loadCapacity}kg
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(robot.currentLoad / robot.loadCapacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance Schedule */}
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Maintenance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Service:</span>
                        <span className="font-medium">{robot.lastMaintenance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Service:</span>
                        <span className="font-medium">{robot.nextMaintenance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Battery Health:</span>
                        <span className={`font-medium ${getBatteryColor(100, robot.batteryHealth)}`}>
                          {robot.batteryHealth}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temperature:</span>
                        <span className={`font-medium ${robot.temperature > 50 ? "text-red-600" : "text-green-600"}`}>
                          {Math.round(robot.temperature)}°C
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Signal Strength:</span>
                        <span className="font-medium">{robot.signalStrength}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
