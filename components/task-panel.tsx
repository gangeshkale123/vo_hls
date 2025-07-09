"use client"

import type React from "react"

import { useState } from "react"
import { Package, CheckCircle, AlertTriangle, QrCode, Lock } from "lucide-react"

interface TaskPanelProps {
  canAccessTaskPanel: boolean
  currentUserRole: string
  tasks: any[]
  addTask: (taskData: any) => void
  addNotification: (message: string) => void
  t: (key: string) => string
}

export function TaskPanel({ canAccessTaskPanel, currentUserRole, tasks, addTask, addNotification, t }: TaskPanelProps) {
  const [serviceType, setServiceType] = useState("")
  const [pickUpLocation, setPickUpLocation] = useState("")
  const [dropOffLocation, setDropOffLocation] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("Medium")
  const [patientId, setPatientId] = useState("")
  const [requestedBy, setRequestedBy] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")

  const locations = [
    "Room 101",
    "Room 102",
    "Lab 205",
    "Pharmacy",
    "Storage Unit A",
    "Nurse Station",
    "OR 1",
    "OR 2",
    "Cleaning Supply",
    "Reception",
    "Radiology",
    "Laboratory",
    "Emergency Room",
    "Main Corridor",
    "General Ward A",
    "General Ward B",
    "Surgery Room 1",
    "Surgery Room 2",
    "ICU Ward",
    "Storage Room",
    "Kitchen",
    "Laundry",
    "Waste Management",
  ]

  const availableRobots = [
    { id: "Robot A", status: "Available", battery: 85 },
    { id: "Robot B", status: "Available", battery: 92 },
    { id: "Robot C", status: "Busy", battery: 60 },
    { id: "Robot D", status: "Charging", battery: 20 },
  ]

  const robotsActuallyAvailable = availableRobots.filter((robot) => robot.status === "Available")

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newRobot = formData.get("robotAssignment") as string

    if (serviceType && newRobot && pickUpLocation && dropOffLocation && requestedBy) {
      addTask({
        name: serviceType,
        robot: newRobot,
        pickUp: pickUpLocation,
        dropOff: dropOffLocation,
        priority: selectedPriority,
        patientId,
        requestedBy,
        specialInstructions,
      })

      // Clear form
      setServiceType("")
      setPickUpLocation("")
      setDropOffLocation("")
      setPatientId("")
      setRequestedBy("")
      setSpecialInstructions("")
      setSelectedPriority("Medium")
      ;(e.target as HTMLFormElement).reset()
    } else {
      addNotification(
        "Please fill in all required task details: Service Type, Pick Up, Drop Off, Assign Robot, and Requested By.",
      )
    }
  }

  const handleQrCodeScan = () => {
    const qrInput = document.getElementById("qrCodeInput") as HTMLInputElement
    const qrValue = qrInput?.value
    if (qrValue) {
      addNotification(`QR Code Scanned: "${qrValue}". Displaying details. (Simulated)`)
      const randomCompartment = Math.floor(Math.random() * 4) + 1
      addNotification(`Simulated: Item ${qrValue} is in compartment ${randomCompartment}.`)
    } else {
      addNotification("Please enter a QR Code value to scan.")
    }
  }

  if (!canAccessTaskPanel) {
    return (
      <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm overflow-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">{t("taskPanel")}</h2>
        <div className="bg-orange-50 p-6 rounded-xl text-orange-800 text-center text-lg font-semibold border border-orange-200">
          <Lock className="inline-block mr-2" size={24} />
          Access Denied: Your current role ({currentUserRole}) does not have permission to view the Task Panel.
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm overflow-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{t("taskPanel")}</h2>

      <div className="max-w-xl mx-auto bg-gray-50 p-8 rounded-xl shadow-inner border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <Package className="mr-2" size={28} /> {t("requestRobotService")}
          </h3>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              robotsActuallyAvailable.length > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {robotsActuallyAvailable.length} {t("robotsAvailable")}
          </span>
        </div>

        <form onSubmit={handleAddTask} className="space-y-6">
          {/* Service Type Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("serviceType")} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t("medicationDelivery"), icon: "💊" },
                { label: t("labSampleTransport"), icon: "🧪" },
                { label: t("medicalEquipment"), icon: "🩺" },
                { label: t("foodDelivery"), icon: "🍔" },
                { label: t("textileService"), icon: "🧺" },
                { label: t("wasteDisposal"), icon: "🗑️" },
                { label: t("bloodTransport"), icon: "🩸" },
                { label: t("oxygenDelivery"), icon: "🫁" },
              ].map((type) => (
                <button
                  key={type.label}
                  type="button"
                  onClick={() => setServiceType(type.label)}
                  className={`flex flex-col items-center justify-center p-3 border rounded-lg text-sm font-medium transition-all duration-200
                    ${serviceType === type.label ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"}
                  `}
                >
                  <span className="text-2xl mb-1">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Robot Assignment */}
          <div>
            <label htmlFor="robotAssignment" className="block text-sm font-medium text-gray-700 mb-2">
              {t("assignRobot")} <span className="text-red-500">*</span>
            </label>
            <select
              id="robotAssignment"
              name="robotAssignment"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base bg-white"
              disabled={robotsActuallyAvailable.length === 0}
            >
              <option value="">{t("selectRobot")}</option>
              {robotsActuallyAvailable.map((robot) => (
                <option key={robot.id} value={robot.id}>
                  {robot.id}
                </option>
              ))}
            </select>
            {robotsActuallyAvailable.length === 0 && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertTriangle size={16} className="mr-1" /> {t("allRobotsBusy")}
              </p>
            )}
          </div>

          {/* Pickup Location */}
          <div>
            <label htmlFor="pickUpLocation" className="block text-sm font-medium text-gray-700 mb-2">
              {t("pickupLocation")} <span className="text-red-500">*</span>
            </label>
            <select
              id="pickUpLocation"
              value={pickUpLocation}
              onChange={(e) => setPickUpLocation(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base bg-white"
            >
              <option value="">{t("selectPickup")}</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="dropOffLocation" className="block text-sm font-medium text-gray-700 mb-2">
              {t("destination")} <span className="text-red-500">*</span>
            </label>
            <select
              id="dropOffLocation"
              value={dropOffLocation}
              onChange={(e) => setDropOffLocation(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base bg-white"
            >
              <option value="">{t("selectDropoff")}</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("priorityLevel")} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Low", "Medium", "High", "Emergency"].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setSelectedPriority(priority)}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all duration-200
                    ${
                      selectedPriority === priority
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-300"
                    }
                  `}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Patient ID */}
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
              {t("patientIdOptional")}
            </label>
            <input
              type="text"
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
              placeholder={t("enterPatientId")}
            />
          </div>

          {/* Requested By */}
          <div>
            <label htmlFor="requestedBy" className="block text-sm font-medium text-gray-700 mb-2">
              {t("requestedBy")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="requestedBy"
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
              placeholder={t("yourNameOrStaffId")}
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-2">
              {t("specialInstructions")}
            </label>
            <textarea
              id="specialInstructions"
              rows={3}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base resize-y"
              placeholder={t("anySpecialHandlingInstructions")}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4 border border-transparent shadow-lg text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              <CheckCircle className="h-6 w-6 mr-3" />
              {t("assignTaskAndUpdateRobot")}
            </button>
          </div>
        </form>
      </div>

      {/* QR Code Scanner */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("qrCodeScan")}</h3>
        <p className="text-gray-600 mb-4">{t("scanQrPrompt")}</p>
        <div className="flex space-x-3">
          <input
            type="text"
            id="qrCodeInput"
            placeholder={t("qrCodeValue")}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <button
            onClick={handleQrCodeScan}
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            <QrCode className="h-5 w-5 mr-2" />
            {t("getDetails")}
          </button>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("recentTaskAssignments")}</h3>
        {tasks.length > 0 ? (
          <ul className="space-y-4">
            {tasks
              .slice()
              .reverse()
              .map((task) => (
                <li key={task.id} className="bg-gray-50 p-4 rounded-xl flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{task.name}</p>
                    <p className="text-sm text-gray-600">
                      {t("assignRobot")}: <span className="font-semibold">{task.robot}</span> - Status:{" "}
                      <span className="font-semibold">{task.status}</span>
                    </p>
                    {task.signature && <p className="text-xs text-gray-500">Signed by: {task.signature}</p>}
                  </div>
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      task.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : task.status === "In Transit"
                          ? "bg-yellow-100 text-yellow-800"
                          : task.status === "Failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">{t("noRecentTasks")}</p>
        )}
      </div>
    </div>
  )
}
