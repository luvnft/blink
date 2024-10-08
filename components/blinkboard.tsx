import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Send, CreditCard } from 'lucide-react'

interface BlinkStats {
  totalBlinks: number;
  sentBlinks: number;
  receivedBlinks: number;
}

interface BlinkboardProps {
  stats: BlinkStats;
}

export function Blinkboard({ stats }: BlinkboardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Blinks</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBlinks}</div>
          <p className="text-xs text-muted-foreground">
            Your total Blink collection
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sent Blinks</CardTitle>
          <Send className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.sentBlinks}</div>
          <p className="text-xs text-muted-foreground">
            Blinks you've sent to others
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Received Blinks</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.receivedBlinks}</div>
          <p className="text-xs text-muted-foreground">
            Blinks you've received from others
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent activity to display.
          </p>
        </CardContent>
      </Card>
      <div className="md:col-span-2 lg:col-span-3">
        <Button className="w-full">View All Blinks</Button>
      </div>
    </div>
  )
}