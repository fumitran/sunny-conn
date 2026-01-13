'use client'

import { useState } from 'react'
import KidView from '@/components/KidView'
import ParentView from '@/components/ParentView'
import { Lock, X } from 'lucide-react'

export default function HomePage() {
  const [showParentView, setShowParentView] = useState(false)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)

  const CORRECT_PIN = '1234' // Default PIN - can be changed

  const handlePinSubmit = () => {
    if (pin === CORRECT_PIN) {
      setShowParentView(true)
      setShowPinDialog(false)
      setPin('')
      setPinError(false)
    } else {
      setPinError(true)
      setPin('')
      // Clear error after 2 seconds
      setTimeout(() => setPinError(false), 2000)
    }
  }

  const handlePinChange = (value: string) => {
    // Only allow digits and max 4 characters
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value)
      setPinError(false)
    }
  }

  const closeParentView = () => {
    setShowParentView(false)
  }

  const openPinDialog = () => {
    setShowPinDialog(true)
    setPin('')
    setPinError(false)
  }

  const closePinDialog = () => {
    setShowPinDialog(false)
    setPin('')
    setPinError(false)
  }

  // Show Parent View if unlocked
  if (showParentView) {
    return <ParentView onClose={closeParentView} />
  }

  return (
    <>
      {/* Kid's View */}
      <div className="relative">
        <KidView />

        {/* Hidden Button to Access Parent View */}
        <button
          onClick={openPinDialog}
          className="fixed bottom-4 right-4 w-12 h-12 bg-gray-300 rounded-full opacity-20 hover:opacity-40 transition-opacity"
          aria-label="Parent access"
        >
          <Lock className="mx-auto text-gray-600" size={20} />
        </button>
      </div>

      {/* PIN Dialog Overlay */}
      {showPinDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-slide-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Parent Access</h2>
              <button
                onClick={closePinDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">Enter 4-digit PIN to continue</p>

            {/* PIN Input */}
            <div className="mb-6">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && pin.length === 4 && handlePinSubmit()}
                placeholder="••••"
                maxLength={4}
                autoFocus
                className={`w-full text-center text-4xl font-bold tracking-widest px-4 py-4 border-2 rounded-2xl focus:outline-none ${
                  pinError
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300 focus:border-purple-400'
                }`}
              />
              {pinError && (
                <p className="text-red-500 text-sm mt-2 text-center animate-slide-in">
                  ❌ Incorrect PIN. Please try again.
                </p>
              )}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePinChange(pin + num)}
                  disabled={pin.length >= 4}
                  className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-2xl font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handlePinChange('')}
                className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-sm font-semibold py-4 rounded-xl transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => handlePinChange(pin + '0')}
                disabled={pin.length >= 4}
                className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-2xl font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                0
              </button>
              <button
                onClick={() => handlePinChange(pin.slice(0, -1))}
                className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-sm font-semibold py-4 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePinSubmit}
              disabled={pin.length !== 4}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Unlock
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Default PIN: 1234
            </p>
          </div>
        </div>
      )}
    </>
  )
}
