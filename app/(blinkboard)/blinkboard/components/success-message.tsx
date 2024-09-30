import React from 'react'

export const SuccessMessage: React.FC = () => {
  return (
    <div className="p-4 bg-green-100 rounded-md">
      <h2 className="text-lg font-semibold text-green-800">Thank You!</h2>
      <p className="text-sm text-green-600">Your donation has been successfully processed.</p>
    </div>
  )
}
