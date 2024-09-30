import React from 'react'
import { BlinkCard } from '../components/blink-card'
import { useBlinkData } from '../hooks/use-blink-data'

export default function Blinkboard() {
  const { blinkActions, loading } = useBlinkData()

  if (loading) return <p>Loading...</p>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Blinkboard</h1>
      {blinkActions.map((action) => (
        <BlinkCard
          key={action.id}
          title={action.title}
          description={action.description}
          date={action.date}
        />
      ))}
    </div>
  )
}
