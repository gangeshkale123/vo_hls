"use client"

import { useState } from "react"
import { XCircle } from "lucide-react"

interface DigitalSignatureModalProps {
  task: any
  onSign: (taskId: number, signature: string) => void
  onClose: () => void
  t: (key: string) => string
}

export function DigitalSignatureModal({ task, onSign, onClose, t }: DigitalSignatureModalProps) {
  const [signature, setSignature] = useState("")

  const handleSubmit = () => {
    if (signature.trim()) {
      onSign(task.id, signature)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Digital Signature for Delivery</h3>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close signature pad"
        >
          <XCircle size={24} />
        </button>

        <p className="text-gray-700 mb-4">
          {t("digitalSignaturePrompt")} <span className="font-semibold">{task.name}</span>
        </p>

        <div className="mb-4">
          <label htmlFor="signaturePad" className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Signature (Type your name)
          </label>
          <input
            type="text"
            id="signaturePad"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
            placeholder={t("signaturePlaceholder")}
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!signature.trim()}
          >
            {t("signAndConfirm")}
          </button>
        </div>
      </div>
    </div>
  )
}
