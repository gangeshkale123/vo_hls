"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, Lock } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DeliveryDashboard } from "@/components/delivery-dashboard"
import { TaskPanel } from "@/components/task-panel"
import { VoiceCommand } from "@/components/voice-command"
import { NotificationModal } from "@/components/notification-modal"
import { DigitalSignatureModal } from "@/components/digital-signature-modal"
import { HospitalLayout } from "@/components/hospital-layout"
import { RobotFleet } from "@/components/robot-fleet"
import { translations } from "@/lib/translations"
import { useNotifications } from "@/hooks/use-notifications"
import { useTasks } from "@/hooks/use-tasks"
import { useVoiceCommand } from "@/hooks/use-voice-command"

export function HospitalDashboard() {
  const [currentUserRole, setCurrentUserRole] = useState("Nurse")
  const [activeSection, setActiveSection] = useState("delivery")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [emergencyStopped, setEmergencyStopped] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showDigitalSignatureModal, setShowDigitalSignatureModal] = useState(false)
  const [taskToSign, setTaskToSign] = useState(null)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  const t = useCallback((key: string) => translations[selectedLanguage][key] || key, [selectedLanguage])

  const { notifications, addNotification } = useNotifications()
  const { tasks, addTask, updateTask, inventory } = useTasks(emergencyStopped, hasUserInteracted, addNotification, t)
  const { voiceCommandInput, isListening, handleVoiceCommandToggle } = useVoiceCommand(
    selectedLanguage,
    t,
    addNotification,
    setActiveSection,
  )

  // Effect to set hasUserInteracted to true on first click
  useEffect(() => {
    const handleFirstClick = () => {
      setHasUserInteracted(true)
      document.removeEventListener("click", handleFirstClick)
    }
    document.addEventListener("click", handleFirstClick)
    return () => {
      document.removeEventListener("click", handleFirstClick)
    }
  }, [])

  const handleEmergencyStop = () => {
    if (window.confirm(t("emergencyStopConfirm"))) {
      setEmergencyStopped(true)
      addNotification(t("robotHalted"))
    }
  }

  const handleResumeRobots = () => {
    setEmergencyStopped(false)
    addNotification(t("robotResumed"))
  }

  const openDigitalSignature = (taskId: number) => {
    const task = tasks.find((taskItem) => taskItem.id === taskId)
    if (task) {
      setTaskToSign(task)
      setShowDigitalSignatureModal(true)
    }
  }

  const handleDigitalSign = (taskId: number, signature: string) => {
    updateTask(taskId, { signature, status: "Delivered", progress: 100 })
    addNotification(`Delivery of "${taskToSign?.name}" confirmed by signature: "${signature}".`)
    setShowDigitalSignatureModal(false)
    setTaskToSign(null)
  }

  // Role-based access control
  const canAccessTaskPanel = ["Nurse", "Doctor", "Technician"].includes(currentUserRole)
  const canViewInventory = ["Nurse", "Technician"].includes(currentUserRole)
  const canManageRoutes = ["Technician"].includes(currentUserRole)

  if (currentUserRole === "Family Member") {
    return (
      <div className="flex h-screen bg-gray-100 font-sans antialiased text-gray-800">
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center m-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">{t("companionApp")}</h2>
          <Users size={64} className="text-blue-400 mb-4" />
          <p className="text-lg text-gray-700 max-w-md">{t("companionAppDesc")}</p>
          <p className="mt-4 text-gray-500">Your view is tailored to receive updates on patient deliveries.</p>
          {notifications.filter((notif) => !["delay", "refusal", "failed"].includes(notif.type)).length > 0 && (
            <div className="mt-8 w-full max-w-md bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">{t("notifications")}</h4>
              <ul className="text-left space-y-2">
                {notifications
                  .filter((notif) => !["delay", "refusal", "failed"].includes(notif.type))
                  .map((notif, index) => (
                    <li key={index} className="text-sm text-blue-700">
                      {notif.message}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased text-gray-800">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        canAccessTaskPanel={canAccessTaskPanel}
        canViewInventory={canViewInventory}
        t={t}
      />

      <main className="flex-1 p-6 flex flex-col">
        <Header
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          currentUserRole={currentUserRole}
          notifications={notifications}
          setShowNotifications={setShowNotifications}
          emergencyStopped={emergencyStopped}
          handleEmergencyStop={handleEmergencyStop}
          handleResumeRobots={handleResumeRobots}
          t={t}
        />

        {activeSection === "delivery" && (
          <DeliveryDashboard
            tasks={tasks}
            openDigitalSignature={openDigitalSignature}
            canManageRoutes={canManageRoutes}
            t={t}
          />
        )}

        {activeSection === "task" && (
          <TaskPanel
            canAccessTaskPanel={canAccessTaskPanel}
            currentUserRole={currentUserRole}
            tasks={tasks}
            addTask={addTask}
            addNotification={addNotification}
            t={t}
          />
        )}

        {activeSection === "voice" && (
          <VoiceCommand
            voiceCommandInput={voiceCommandInput}
            isListening={isListening}
            handleVoiceCommandToggle={handleVoiceCommandToggle}
            t={t}
          />
        )}

        {activeSection === "inventory" && (
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm overflow-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">{t("inventoryAutoUpdate")}</h2>
            {canViewInventory ? (
              <div className="bg-gray-50 p-8 rounded-xl shadow-inner border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("currentInventory")}</h3>
                <ul className="space-y-4">
                  {Object.entries(inventory).map(([item, quantity]) => (
                    <li
                      key={item}
                      className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    >
                      <span className="text-lg font-medium text-gray-900">{item}</span>
                      <span className="text-xl font-bold text-blue-700">{quantity} units</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Inventory levels update automatically upon delivery completion.
                </p>
              </div>
            ) : (
              <div className="bg-orange-50 p-6 rounded-xl text-orange-800 text-center text-lg font-semibold border border-orange-200">
                <Lock className="inline-block mr-2" size={24} />
                Access Denied: Your current role ({currentUserRole}) does not have permission to view Inventory.
              </div>
            )}
          </div>
        )}

        {activeSection === "hospitalLayout" && <HospitalLayout t={t} />}

        {activeSection === "robotFleet" && <RobotFleet t={t} />}
      </main>

      {showNotifications && (
        <NotificationModal notifications={notifications} onClose={() => setShowNotifications(false)} t={t} />
      )}

      {showDigitalSignatureModal && taskToSign && (
        <DigitalSignatureModal
          task={taskToSign}
          onSign={handleDigitalSign}
          onClose={() => setShowDigitalSignatureModal(false)}
          t={t}
        />
      )}
    </div>
  )
}
