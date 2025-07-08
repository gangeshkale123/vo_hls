"use client"

import { Mic } from "lucide-react"

interface VoiceCommandProps {
  voiceCommandInput: string
  isListening: boolean
  handleVoiceCommandToggle: () => void
  t: (key: string) => string
}

export function VoiceCommand({ voiceCommandInput, isListening, handleVoiceCommandToggle, t }: VoiceCommandProps) {
  return (
    <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm overflow-auto flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">{t("voiceCommand")}</h2>

      <div className="relative w-48 h-48 mb-8">
        <div
          className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
            isListening ? "bg-blue-200 animate-pulse" : "bg-blue-100"
          }`}
        >
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
              isListening ? "bg-blue-400" : "bg-blue-300"
            }`}
          >
            <button
              onClick={handleVoiceCommandToggle}
              className={`flex items-center justify-center w-24 h-24 rounded-full text-white shadow-lg transform transition-all duration-300 ease-in-out
                ${isListening ? "bg-red-500 scale-105 ring-4 ring-red-300" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}
              `}
              aria-label={isListening ? "Stop listening for voice commands" : "Activate voice commands"}
            >
              <Mic size={48} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-lg text-gray-600 mb-4">{isListening ? t("listening") : t("clickMic")}</p>

      <div className="w-full max-w-md">
        <textarea
          value={voiceCommandInput}
          readOnly
          className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder={t("spokenCommand")}
        />
      </div>

      <p className="text-sm text-gray-500 mt-4">{t("voiceSupportText")}</p>
    </div>
  )
}
