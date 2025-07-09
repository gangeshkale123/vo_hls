"use client"

import { useState, useEffect, useRef } from "react"
import * as Tone from "tone"

export interface Task {
  id: number
  name: string
  robot: string
  status: string
  progress: number
  room: string
  signatureNeeded: boolean
  priority: string
  compartment: string
  refusalCount: number
  pickUp: string
  dropOff: string
  patientId: string
  requestedBy: string
  specialInstructions: string
  signature?: string
  delayed?: boolean
  refused?: boolean
}

export function useTasks(emergencyStopped: boolean, hasUserInteracted: boolean, addNotification: any, t: any) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [inventory, setInventory] = useState({
    "Surgical Masks": 500,
    "Disposable Gloves": 1200,
    "Syringes (10ml)": 300,
    "IV Bags (Saline)": 85,
    "Blood Collection Tubes": 450,
    "Gauze Bandages": 200,
    "Antiseptic Wipes": 350,
    "Thermometer Covers": 180,
    "Oxygen Masks": 75,
    "Medication Vials": 120,
    "Lab Test Kits": 95,
    "Surgical Instruments": 45,
  })

  const synthRef = useRef<any>(null)

  useEffect(() => {
    if (!synthRef.current) {
      synthRef.current = new Tone.Synth().toDestination()
    }
  }, [])

  useEffect(() => {
    // Initial dummy tasks
    setTasks([
      {
        id: 1,
        name: "Medication Delivery",
        robot: "Robot A",
        status: "In Transit",
        progress: 70,
        room: "Room 101",
        signatureNeeded: true,
        priority: "High",
        compartment: "1",
        refusalCount: 0,
        pickUp: "Pharmacy",
        dropOff: "Room 101",
        patientId: "P101",
        requestedBy: "Dr. Smith",
        specialInstructions: "",
      },
      // ... other initial tasks
    ])

    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (emergencyStopped) return task

          let notificationMessage = ""
          let newStatus = task.status
          let newProgress = task.progress

          if (task.status === "In Transit" && task.progress < 100) {
            newProgress = Math.min(task.progress + 10, 100)

            // Simulate delayed delivery
            if (newProgress === 70 && Math.random() < 0.3 && !task.delayed) {
              notificationMessage = `ALERT: Delivery of "${task.name}" by ${task.robot} to ${task.room} is experiencing a delay.`
              addNotification(notificationMessage, "delay", { taskName: task.name, robot: task.robot, room: task.room })
              return { ...task, delayed: true }
            }

            if (newProgress === 100) {
              newStatus = "Delivered"
              notificationMessage = `${t("deliveryConfirmed")}: Robot ${task.robot} has completed delivery of "${task.name}" to ${task.room}.`

              // Play sound notification
              if (hasUserInteracted && synthRef.current) {
                Tone.start()
                synthRef.current.triggerAttackRelease("C4", "8n")
              }

              // Update inventory
              if (task.name.includes("Medication")) {
                setInventory((prev) => ({ ...prev, "Medication A": Math.max(0, prev["Medication A"] - 1) }))
              } else if (task.name.includes("Supplies")) {
                setInventory((prev) => ({ ...prev, "Medical Supplies": Math.max(0, prev["Medical Supplies"] - 5) }))
              }
            }

            if (notificationMessage && newStatus === "Delivered") {
              addNotification(notificationMessage)
            }

            return { ...task, progress: newProgress, status: newStatus }
          }

          return task
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [emergencyStopped, hasUserInteracted, addNotification, t])

  const addTask = (taskData: Partial<Task>) => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
    const newTask: Task = {
      id: newId,
      name: taskData.name || "",
      robot: taskData.robot || "",
      status: "Pending",
      progress: 0,
      room: taskData.dropOff || "",
      signatureNeeded: false,
      priority: taskData.priority || "Medium",
      compartment: "N/A",
      refusalCount: 0,
      pickUp: taskData.pickUp || "",
      dropOff: taskData.dropOff || "",
      patientId: taskData.patientId || "",
      requestedBy: taskData.requestedBy || "",
      specialInstructions: taskData.specialInstructions || "",
    }

    setTasks((prevTasks) =>
      [...prevTasks, newTask].sort((a, b) => {
        const priorityOrder = { Emergency: 4, High: 3, Medium: 2, Low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }),
    )

    addNotification(`New task "${newTask.name}" assigned to ${newTask.robot}.`)
  }

  const updateTask = (taskId: number, updates: Partial<Task>) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
  }

  return {
    tasks,
    inventory,
    addTask,
    updateTask,
  }
}
