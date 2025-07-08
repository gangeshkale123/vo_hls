"use client"

import { useState } from "react"
import { Bell, XCircle, Sparkles, Loader } from "lucide-react"

interface NotificationModalProps {
  notifications: any[]
  onClose: () => void
  t: (key: string) => string
}

export function NotificationModal({ notifications, onClose, t }: NotificationModalProps) {
  const [analyzingNotificationId, setAnalyzingNotificationId] = useState<number | null>(null)
  const [analysisResult, setAnalysisResult] = useState<Record<number, string>>({})

  const analyzeDelay = async (notifId: number, taskName: string, robot: string, room: string) => {
    setAnalyzingNotificationId(notifId)
    setAnalysisResult((prev) => ({ ...prev, [notifId]: "Analyzing..." }))

    // Simulate analysis
    setTimeout(() => {
      setAnalysisResult((prev) => ({
        ...prev,
        [notifId]: `Possible causes: Heavy traffic in corridor, elevator maintenance, or unexpected obstacle detection.`,
      }))
      setAnalyzingNotificationId(null)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <h3 className="text-xl font-bold mb-4 text-gray-800">{t("notificationTitle")}</h3>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notifications"
        >
          <XCircle size={24} />
        </button>

        {notifications.length > 0 ? (
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.map((notif, index) => (
              <li key={index} className="flex items-start bg-gray-50 p-3 rounded-lg flex-col">
                <div className="flex items-start w-full">
                  <Bell size={18} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notif.message}</p>
                    <p className="text-sm text-gray-600">{new Date(notif.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                {notif.type === "delay" && (
                  <div className="w-full mt-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => analyzeDelay(notif.id, notif.taskName, notif.robot, notif.room)}
                      className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
                      disabled={analyzingNotificationId === notif.id}
                    >
                      {analyzingNotificationId === notif.id ? (
                        <Loader size={16} className="animate-spin mr-1" />
                      ) : (
                        <Sparkles size={16} className="mr-1" />
                      )}
                      {analyzingNotificationId === notif.id ? "Analyzing..." : "Analyze Delay"}
                    </button>

                    {analysisResult[notif.id] && (
                      <p className="text-sm text-gray-700 mt-2 p-2 bg-white rounded-lg border border-gray-200">
                        <span className="font-semibold">Analysis:</span> {analysisResult[notif.id]}
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8">{t("noNotifications")}</p>
        )}
      </div>
    </div>
  )
}
