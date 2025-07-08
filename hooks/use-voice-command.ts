"use client"

import { useState, useEffect, useRef } from "react"

export function useVoiceCommand(selectedLanguage: string, t: any, addNotification: any, setActiveSection: any) {
  const [voiceCommandInput, setVoiceCommandInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const handleVoiceCommandToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceCommandInput("Speech Recognition not supported in this browser.")
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
      setVoiceCommandInput(t("listening"))
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.lang = selectedLanguage === "en" ? "en-US" : "es-ES"
      recognitionRef.current.interimResults = false
      recognitionRef.current.maxAlternatives = 1

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setVoiceCommandInput(transcript)

        // Robot voice feedback
        const speech = new SpeechSynthesisUtterance()
        speech.lang = selectedLanguage === "en" ? "en-US" : "es-ES"
        speech.text = t("robotVoiceFeedback")
        window.speechSynthesis.speak(speech)

        // Process commands
        if (transcript.toLowerCase().includes("assign task")) {
          addNotification(`Voice command received: "${transcript}". Navigating to Task Panel.`)
          setActiveSection("task")
        } else if (transcript.toLowerCase().includes("robot status")) {
          addNotification(`Voice command received: "${transcript}". Checking robot statuses.`)
          setActiveSection("delivery")
        }

        setIsListening(false)
      }

      recognitionRef.current.onspeechend = () => {
        setIsListening(false)
        recognitionRef.current?.stop()
      }

      recognitionRef.current.onerror = (event: any) => {
        setVoiceCommandInput(`${t("Error")}: ${event.error}. ${t("PleaseTryAgain")}`)
        setIsListening(false)
      }
    }

    return () => {
      recognitionRef.current?.stop()
    }
  }, [selectedLanguage, t, addNotification, setActiveSection])

  return {
    voiceCommandInput,
    isListening,
    handleVoiceCommandToggle,
  }
}
