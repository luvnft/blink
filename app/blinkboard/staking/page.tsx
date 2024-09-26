"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/charts"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, Coins, Clock, Percent, Users, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const stakingPools = [
  { name: "BARK", apy: 12.5, totalStaked: 1234567, lockPeriod: 30, color: "bg-blue-500" },
  { name: "BARK-SOL LP", apy: 18.75, totalStaked: 987654, lockPeriod: 60, color: "bg-green-500" },
  { name: "BARK-USDC LP", apy: 15.0, totalStaked: 567890, lockPeriod: 90, color: "bg-purple-500" },
]

export default function StakingPage() {
  const [activePool, setActivePool] = useState(stakingPools[0])
  const [stakeAmount, setStakeAmount] = useState("")

  const handleStake = () => {
    console.log(`Staking ${stakeAmount} ${activePool.name}`)
  }

  const handleUnstake = () => {
    console.log(`Unstaking from ${activePool.name}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Staking</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Staked", value: "2,790,111 BARK", change: "+5.1%", trend: "up", icon: Coins },
          { title: "Average APY", value: "15.42%", change: "-0.3%", trend: "down", icon: Percent },
          { title: "Total Rewards", value: "345,678 BARK", change: "+12.3%", trend: "up", icon: Coins },
          { title: "Active Stakers", value: "12,345", change: "+3.2%", trend: "up", icon: Users },
        ].map((stat, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-[#D0BFB4]" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">from last period</span>
                <span className={`text-xs font-medium flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                  )}
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staking Pools</CardTitle>
          <CardDescription>Choose a pool to stake your tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activePool.name} onValueChange={(value) => setActivePool(stakingPools.find(pool => pool.name === value) || stakingPools[0])}>
            <TabsList className="grid w-full grid-cols-3">
              {stakingPools.map((pool) => (
                <TabsTrigger key={pool.name} value={pool.name}>{pool.name}</TabsTrigger>
              ))}
            </TabsList>
            {stakingPools.map((pool) => (
              <TabsContent key={pool.name} value={pool.name}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: "Annual Percentage Yield (APY)", value: `${pool.apy}%`, color: "text-green-600" },
                      { title: "Total Staked", value: `${pool.totalStaked.toLocaleString()} ${pool.name.split('-')[0]}` },
                      { title: "Lock Period", value: `${pool.lockPeriod} days`, tooltip: "The period your tokens will be locked for staking" },
                    ].map((item, index) => (
                      <Card key={index} className="col-span-1">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className={`text-2xl font-bold ${item.color || ''} flex items-center`}>
                            {item.value}
                            {item.tooltip && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{item.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Stake {pool.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="stake-amount">Amount</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="stake-amount"
                            placeholder="Enter amount"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                          />
                          <Button onClick={handleStake}>Stake</Button>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Estimated Returns</h4>
                        <div className="text-2xl font-bold text-green-600">
                          {stakeAmount ? `+${(Number(stakeAmount) * pool.apy / 100).toFixed(2)} ${pool.name.split('-')[0]}` : '--'}
                        </div>
                        <p className="text-xs text-muted-foreground">per year</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Staking Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">50,000 BARK</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium">Estimated Rewards</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-[#D0BFB4]">6,250 BARK</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium">Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Button onClick={handleUnstake} className="w-full">Unstake</Button>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">Staking Progress</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>0 days</span>
                  <span>30 days</span>
                </div>
                <Progress value={33} className="w-full" />
                <p className="text-xs text-muted-foreground">10 days left in lock period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">Staking History</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-[200px]">
                  <LineChart
                    data={[
                      { name: 'Week 1', value: 50000 },
                      { name: 'Week 2', value: 51250 },
                      { name: 'Week 3', value: 52500 },
                      { name: 'Week 4', value: 53750 },
                      { name: 'Week 5', value: 55000 },
                      { name: 'Week 6', value: 56250 },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}