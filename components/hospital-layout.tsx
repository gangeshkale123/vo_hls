"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MapPin, Navigation, AlertTriangle, CheckCircle, Clock, Zap, Wifi } from "lucide-react"

interface Robot {
  id: string
  name: string
  x: number
  y: number
  status: "idle" | "moving" | "delivering" | "charging" | "maintenance"
  battery: number
  currentTask?: string
  destination?: string
  path?: { x: number; y: number }[]
  speed: number
}

interface Room {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  type: "room" | "corridor" | "station" | "storage" | "emergency"
  color: string
}

interface HospitalLayoutProps {
  t: (key: string) => string
}

export function HospitalLayout({ t }: HospitalLayoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null)
  const [showPaths, setShowPaths] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [robots, setRobots] = useState<Robot[]>([
    {
      id: "robot-a",
      name: "Robot A",
      x: 150,
      y: 200,
      status: "delivering",
      battery: 85,
      currentTask: "Medication Delivery to Room 101",
      destination: "Room 101",
      path: [
        { x: 150, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 150 },
        { x: 300, y: 150 },
      ],
      speed: 2,
    },
    {
      id: "robot-b",
      name: "Robot B",
      x: 400,
      y: 300,
      status: "moving",
      battery: 92,
      currentTask: "Lab Sample Transport",
      destination: "Laboratory",
      path: [
        { x: 400, y: 300 },
        { x: 450, y: 300 },
        { x: 450, y: 250 },
        { x: 500, y: 250 },
      ],
      speed: 1.5,
    },
    {
      id: "robot-c",
      name: "Robot C",
      x: 100,
      y: 400,
      status: "charging",
      battery: 25,
      speed: 0,
    },
    {
      id: "robot-d",
      name: "Robot D",
      x: 350,
      y: 180,
      status: "idle",
      battery: 78,
      speed: 0,
    },
  ])

  const rooms: Room[] = [
    // Top Row
    { id: "reception", name: "Reception", x: 50, y: 50, width: 100, height: 80, type: "station", color: "#E3F2FD" },
    { id: "radiology", name: "Radiology", x: 200, y: 50, width: 100, height: 80, type: "room", color: "#F3E5F5" },
    { id: "pharmacy", name: "Pharmacy", x: 350, y: 50, width: 100, height: 80, type: "storage", color: "#E8F5E8" },
    { id: "laboratory", name: "Laboratory", x: 500, y: 50, width: 100, height: 80, type: "room", color: "#FFF3E0" },

    // Emergency Room
    { id: "emergency", name: "Emergency", x: 50, y: 180, width: 80, height: 100, type: "emergency", color: "#FFEBEE" },

    // Main Corridor
    {
      id: "corridor",
      name: "Main Corridor",
      x: 150,
      y: 180,
      width: 400,
      height: 60,
      type: "corridor",
      color: "#F5F5F5",
    },

    // Middle Row
    { id: "ward-a", name: "Ward A", x: 50, y: 320, width: 100, height: 80, type: "room", color: "#E1F5FE" },
    { id: "ward-b", name: "Ward B", x: 200, y: 320, width: 100, height: 80, type: "room", color: "#E1F5FE" },
    { id: "surgery-1", name: "Surgery 1", x: 350, y: 320, width: 100, height: 80, type: "room", color: "#FCE4EC" },
    { id: "surgery-2", name: "Surgery 2", x: 500, y: 320, width: 100, height: 80, type: "room", color: "#FCE4EC" },
    { id: "icu", name: "ICU", x: 650, y: 320, width: 100, height: 80, type: "room", color: "#FFF8E1" },

    // Storage
    { id: "storage", name: "Storage", x: 350, y: 450, width: 100, height: 60, type: "storage", color: "#F1F8E9" },

    // Bottom Row
    { id: "kitchen", name: "Kitchen", x: 50, y: 450, width: 80, height: 60, type: "station", color: "#E8EAF6" },
    { id: "laundry", name: "Laundry", x: 150, y: 450, width: 80, height: 60, type: "station", color: "#E0F2F1" },
    { id: "waste", name: "Waste Mgmt", x: 250, y: 450, width: 80, height: 60, type: "station", color: "#EFEBE9" },

    // Charging Stations
    { id: "charging-1", name: "Charging 1", x: 80, y: 380, width: 40, height: 20, type: "station", color: "#FFFDE7" },
    { id: "charging-2", name: "Charging 2", x: 680, y: 280, width: 40, height: 20, type: "station", color: "#FFFDE7" },
  ]

  // Animation loop for robot movement
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setRobots((prevRobots) =>
        prevRobots.map((robot) => {
          if (robot.status === "moving" || robot.status === "delivering") {
            if (robot.path && robot.path.length > 1) {
              const target = robot.path[1]
              const dx = target.x - robot.x
              const dy = target.y - robot.y
              const distance = Math.sqrt(dx * dx + dy * dy)

              if (distance < robot.speed) {
                // Reached waypoint, move to next
                const newPath = robot.path.slice(1)
                if (newPath.length === 1) {
                  // Reached destination
                  return {
                    ...robot,
                    x: target.x,
                    y: target.y,
                    status: "idle",
                    path: undefined,
                    currentTask: undefined,
                    destination: undefined,
                  }
                }
                return {
                  ...robot,
                  x: target.x,
                  y: target.y,
                  path: newPath,
                }
              } else {
                // Move towards target
                const moveX = (dx / distance) * robot.speed
                const moveY = (dy / distance) * robot.speed
                return {
                  ...robot,
                  x: robot.x + moveX,
                  y: robot.y + moveY,
                }
              }
            }
          }
          return robot
        }),
      )
    }, 50)

    return () => clearInterval(animationInterval)
  }, [])

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw rooms
    rooms.forEach((room) => {
      ctx.fillStyle = room.color
      ctx.fillRect(room.x, room.y, room.width, room.height)
      ctx.strokeStyle = "#CCCCCC"
      ctx.lineWidth = 1
      ctx.strokeRect(room.x, room.y, room.width, room.height)

      // Room labels
      ctx.fillStyle = "#333333"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(room.name, room.x + room.width / 2, room.y + room.height / 2 + 4)
    })

    // Draw robot paths
    if (showPaths) {
      robots.forEach((robot) => {
        if (robot.path && robot.path.length > 1) {
          ctx.strokeStyle = robot.id === selectedRobot ? "#FF6B6B" : "#4ECDC4"
          ctx.lineWidth = robot.id === selectedRobot ? 3 : 2
          ctx.setLineDash([5, 5])
          ctx.beginPath()
          ctx.moveTo(robot.path[0].x, robot.path[0].y)
          for (let i = 1; i < robot.path.length; i++) {
            ctx.lineTo(robot.path[i].x, robot.path[i].y)
          }
          ctx.stroke()
          ctx.setLineDash([])
        }
      })
    }

    // Draw robots
    robots.forEach((robot) => {
      const isSelected = robot.id === selectedRobot
      const radius = isSelected ? 12 : 10

      // Robot body
      ctx.fillStyle = getRobotColor(robot.status)
      ctx.beginPath()
      ctx.arc(robot.x, robot.y, radius, 0, 2 * Math.PI)
      ctx.fill()

      // Robot border
      ctx.strokeStyle = isSelected ? "#FF6B6B" : "#333333"
      ctx.lineWidth = isSelected ? 3 : 2
      ctx.stroke()

      // Robot label
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(robot.name.split(" ")[1], robot.x, robot.y + 3)

      // Battery indicator
      if (robot.battery < 30) {
        ctx.fillStyle = "#FF4444"
        ctx.beginPath()
        ctx.arc(robot.x + 8, robot.y - 8, 4, 0, 2 * Math.PI)
        ctx.fill()
      }

      // Movement direction indicator
      if (robot.status === "moving" || robot.status === "delivering") {
        if (robot.path && robot.path.length > 1) {
          const target = robot.path[1]
          const angle = Math.atan2(target.y - robot.y, target.x - robot.x)
          ctx.fillStyle = "#333333"
          ctx.beginPath()
          ctx.moveTo(robot.x + Math.cos(angle) * 15, robot.y + Math.sin(angle) * 15)
          ctx.lineTo(robot.x + Math.cos(angle - 0.5) * 10, robot.y + Math.sin(angle - 0.5) * 10)
          ctx.lineTo(robot.x + Math.cos(angle + 0.5) * 10, robot.y + Math.sin(angle + 0.5) * 10)
          ctx.closePath()
          ctx.fill()
        }
      }
    })

    // Draw heat map overlay if enabled
    if (showHeatmap) {
      const gradient = ctx.createRadialGradient(300, 250, 0, 300, 250, 100)
      gradient.addColorStop(0, "rgba(255, 0, 0, 0.3)")
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(200, 150, 200, 200)
    }
  }, [robots, selectedRobot, showPaths, showHeatmap])

  const getRobotColor = (status: Robot["status"]) => {
    switch (status) {
      case "idle":
        return "#4ECDC4"
      case "moving":
        return "#45B7D1"
      case "delivering":
        return "#96CEB4"
      case "charging":
        return "#FFEAA7"
      case "maintenance":
        return "#DDA0DD"
      default:
        return "#95A5A6"
    }
  }

  const getStatusIcon = (status: Robot["status"]) => {
    switch (status) {
      case "idle":
        return <CheckCircle className="text-green-500" size={16} />
      case "moving":
        return <Navigation className="text-blue-500" size={16} />
      case "delivering":
        return <Clock className="text-orange-500" size={16} />
      case "charging":
        return <Zap className="text-yellow-500" size={16} />
      case "maintenance":
        return <AlertTriangle className="text-red-500" size={16} />
      default:
        return <Wifi className="text-gray-500" size={16} />
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if click is on a robot
    const clickedRobot = robots.find((robot) => {
      const distance = Math.sqrt((x - robot.x) ** 2 + (y - robot.y) ** 2)
      return distance <= 12
    })

    setSelectedRobot(clickedRobot ? clickedRobot.id : null)
  }

  return (
    <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          <MapPin className="mr-3" size={32} />
          {t("hospitalLayout")}
        </h2>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowPaths(!showPaths)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showPaths ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Show Paths
          </button>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showHeatmap ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Heat Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Layout Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="border border-gray-300 rounded-lg cursor-pointer bg-white"
              onClick={handleCanvasClick}
            />
          </div>

          {/* Legend */}
          <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-400 mr-2"></div>
                <span>Idle Robot</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-400 mr-2"></div>
                <span>Moving Robot</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-orange-400 mr-2"></div>
                <span>Delivering</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
                <span>Charging</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 border border-gray-300 mr-2"></div>
                <span>Patient Room</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border border-gray-300 mr-2"></div>
                <span>Storage</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border border-gray-300 mr-2"></div>
                <span>Emergency</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 border border-gray-300 mr-2"></div>
                <span>Corridor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Robot Status Panel */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Robot Status</h4>
            <div className="space-y-3">
              {robots.map((robot) => (
                <div
                  key={robot.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedRobot === robot.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRobot(robot.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{robot.name}</span>
                    {getStatusIcon(robot.status)}
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Battery:</span>
                      <span className={robot.battery < 30 ? "text-red-500 font-medium" : ""}>{robot.battery}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize">{robot.status}</span>
                    </div>
                    {robot.currentTask && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                        <strong>Task:</strong> {robot.currentTask}
                      </div>
                    )}
                    {robot.destination && (
                      <div className="text-xs text-blue-600">
                        <strong>→ {robot.destination}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Quick Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Robots:</span>
                <span className="font-medium">{robots.filter((r) => r.status !== "charging").length}/4</span>
              </div>
              <div className="flex justify-between">
                <span>In Transit:</span>
                <span className="font-medium">
                  {robots.filter((r) => r.status === "moving" || r.status === "delivering").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Charging:</span>
                <span className="font-medium">{robots.filter((r) => r.status === "charging").length}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Battery:</span>
                <span className="font-medium">
                  {Math.round(robots.reduce((sum, r) => sum + r.battery, 0) / robots.length)}%
                </span>
              </div>
            </div>
          </div>

          {/* Selected Robot Details */}
          {selectedRobot && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">
                {robots.find((r) => r.id === selectedRobot)?.name} Details
              </h4>
              {(() => {
                const robot = robots.find((r) => r.id === selectedRobot)
                if (!robot) return null
                return (
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Position:</span>
                      <span className="font-mono">
                        ({Math.round(robot.x)}, {Math.round(robot.y)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span>{robot.speed} units/sec</span>
                    </div>
                    {robot.path && (
                      <div>
                        <span>Waypoints:</span>
                        <div className="mt-1 text-xs font-mono bg-white p-2 rounded">
                          {robot.path.map((point, i) => (
                            <div key={i}>
                              {i + 1}: ({Math.round(point.x)}, {Math.round(point.y)})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
