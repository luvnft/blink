import React from 'react'
import { useRouter } from 'next/router'
import { useBlinkData } from '../hooks/use-blink-data'

const BlinkDetails: React.FC = () => {
  const { query } = useRouter()
  const { blinkActions } = useBlinkData()
  const blink = blinkActions.find((action) => action.id === query.id)

  if (!blink) return <p>No blink found!</p>

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold">{blink.title}</h2>
      <p className="text-gray-600">{blink.description}</p>
      <p className="text-sm text-gray-500">Date: {new Date(blink.date).toLocaleString()}</p>
      <p className="text-sm text-gray-500">Status: {blink.status}</p>
    </div>
  )
}

export default BlinkDetails
