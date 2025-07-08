"use client"
import { Truck, CheckCircle, Clock, Package, QrCode, PenTool, TrendingUp, AlertTriangle } from "lucide-react"

interface DeliveryDashboardProps {
  tasks: any[]
  openDigitalSignature: (taskId: number) => void
  canManageRoutes: boolean
  t: (key: string) => string
}

export function DeliveryDashboard({ tasks, openDigitalSignature, canManageRoutes, t }: DeliveryDashboardProps) {
  return (
    <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm overflow-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{t("deliveryDashboard")}</h2>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-700">{t("totalDeliveries")}</h3>
            <p className="text-4xl font-extrabold text-blue-900 mt-1">{tasks.length}</p>
          </div>
          <Truck className="text-blue-400 opacity-50" size={48} />
        </div>

        <div className="bg-green-50 p-6 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-700">{t("completed")}</h3>
            <p className="text-4xl font-extrabold text-green-900 mt-1">
              {tasks.filter((task) => task.status === "Delivered").length}
            </p>
          </div>
          <CheckCircle className="text-green-400 opacity-50" size={48} />
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-yellow-700">{t("inProgress")}</h3>
            <p className="text-4xl font-extrabold text-yellow-900 mt-1">
              {tasks.filter((task) => task.status === "In Transit" || task.status === t("attemptingRedelivery")).length}
            </p>
          </div>
          <Clock className="text-yellow-400 opacity-50" size={48} />
        </div>

        <div className="bg-red-50 p-6 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-700">{t("pending")}</h3>
            <p className="text-4xl font-extrabold text-red-900 mt-1">
              {tasks.filter((task) => task.status === "Pending").length}
            </p>
          </div>
          <Package className="text-red-400 opacity-50" size={48} />
        </div>
      </div>

      {/* Robot Details & Room Recognition */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("robotDetails")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks
            .filter((task) => task.status === "In Transit" || task.status === "Pending")
            .map((task) => (
              <div key={task.id} className="bg-blue-50 p-4 rounded-lg flex items-center">
                <QrCode className="text-blue-600 mr-3" size={24} />
                <div>
                  <p className="font-medium text-gray-800">{task.robot}:</p>
                  <p className="text-sm text-gray-600">
                    {t("roomIdentified")}{" "}
                    <span className="font-semibold text-blue-700">{task.room || "Detecting..."} (RFID/QR)</span>
                  </p>
                  {task.compartment && (
                    <p className="text-sm text-gray-600">
                      {t("compartmentActive")}{" "}
                      <span className="font-semibold text-green-700">Compartment {task.compartment} (LED Active)</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Robot Route Management */}
      {canManageRoutes && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("robotRouteManagement")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg flex items-center">
              <TrendingUp className="text-purple-600 mr-3" size={24} />
              <div>
                <p className="font-medium text-gray-800">
                  {t("currentRouteStatus")}{" "}
                  <span className="font-semibold text-purple-700">{t("routeStatusClear")}</span>
                </p>
                <p className="text-sm text-gray-600">({t("selfAvoidance")})</p>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg flex items-center">
              <AlertTriangle className="text-red-600 mr-3" size={24} />
              <div>
                <p className="font-medium text-gray-800">
                  {t("currentRouteStatus")}{" "}
                  <span className="font-semibold text-red-700">{t("routeStatusEmergency")}</span>
                </p>
                <p className="text-sm text-gray-600">(Emergency Rerouting active for Robot C)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Task List */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("liveRobotTasks")}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">
                  {t("taskId")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("description")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pick Up
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Drop Off
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("robot")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("progress")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("priority")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{task.pickUp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{task.dropOff}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{task.robot}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : task.status === "In Transit" || task.status === t("attemptingRedelivery")
                              ? "bg-yellow-100 text-yellow-800"
                              : task.status === "Failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.priority === "Emergency"
                            ? "bg-purple-100 text-purple-800"
                            : task.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "Medium"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {task.signatureNeeded && task.status === "Delivered" && !task.signature && (
                        <button
                          onClick={() => openDigitalSignature(task.id)}
                          className="text-blue-600 hover:text-blue-900 ml-4"
                          title="Get Digital Signature"
                        >
                          <PenTool size={18} />
                        </button>
                      )}
                      {task.signature && (
                        <span className="text-green-600 ml-4 flex items-center">
                          <CheckCircle size={18} className="mr-1" /> Signed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    {t("noRecentTasks")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
